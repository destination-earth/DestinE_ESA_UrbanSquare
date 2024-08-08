# How to integrate the DestinE IAM into an application deployed on Kubernetes cluster

In this tutorial, we will see how to deploy your application on your cloud while relying on the DestinE IAM (Identification and Authentication Management) to authenticate the users.

We will assume that the application to be secured is deployed on a [Kubernetes cluster](https://kubernetes.io/), and can be exposed to the outside behind an [Ingress controller](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/) that acts as reverse proxy.

We will use [OAuth2-proxy](https://oauth2-proxy.github.io/oauth2-proxy/) to handle the authentication process. OAuth2-proxy, implements OAuth2 and OpenID connect protocols.

OAuth2 is a protocol mainly used for authorizing a service provider (you) access user data from an identity provider (DestinE) with the user's permission. OIDC works with the OAuth2 protocol to also verify who the user is, adding an extra layer to confirm the user's identity.

On its side, DestinE uses [Keycloak](https://www.keycloak.org/) to manage user identities and access control, it acts as the OpenID Connect (OIDC) provider.


In our setup, OAuth2-proxy will intercept requests to your application, redirect unauthenticated users to the DestinE Keycloak instance for login, validate the tokens issued by Keycloak, and only allow authenticated and authorized users to access your application.


We will use [Ingress-nginx](https://kubernetes.github.io/ingress-nginx/) as the ingress controller on the cluster, it will also act as SSL termination point. Additionally, we will use [cert-manager](https://cert-manager.io/) to manage the TLS certificates, which are used to expose the app behind HTTPS.

Prerequisites :

- A kubernetes cluster where the app to secure is deployed.
- The ingress controller [Ingress-nginx](https://kubernetes.github.io/ingress-nginx/) is installed on the cluster, and can expose services on the internet (through a load balancer for example)
- You have a domain name that is configured to resolve to the external IP address associated with the ingress controller (e.g., the load balancer address).
  
  In this tutorial we assume the DNS hostname `destine.example.com` is configured to resolve to the ingress controller of your app.
- A workstation from where to run commands, where [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl) and [helm](https://helm.sh/) command line tools are installed and configured with the Kubernetes cluster credentials.

## OIDC client creation

During DESP on-boarding process, you will be requested to provide a couple of information used by DESP to create an OIDC client in DESP Keycloak.

This client will correspond to your application and will be used later in this tutorial.

Assuming you need to expose your application under `https://destine.example.com/yourProject/`, here are the information you need to provide to DESP during the on-boarding process:
- Client Authentication Type: Bearer-Confidential (i.e. Confidential Client)
- Home URL: `https://destine.example.com/yourProject/`
- Valid Redirect URIs: `https://destine.example.com/yourProject/*`
- Valid Post Logout redirect URIs: `https://destine.example.com/yourProject/*`
- Web Origins: `https://destine.example.com`

Once the OIDC client is created on DestinE Keycloak, you can check its existence [here](https://auth.destine.eu/admin/desp/console/#/desp/clients/)


## cert-manager install & config

In case it is not already set-up, you need to install cert-manager in your cluster to manage TLS certificates.

Cert-manager is a very conveniant tool because it can automatically create and renew your (free Let's encrypt) TLS certificates.
If you don't want to use cert-manager, refer to the [OAuth2-proxy TLS configuration page](https://oauth2-proxy.github.io/oauth2-proxy/configuration/tls).

The installation guide of cert-manager using Helm is available [here](https://cert-manager.io/docs/installation/helm/). Other methods are also available.

After installation, you need to configure a certificate issuer. In our case we will use the ACME issuer.

Create a issuer.yml file with this content:

```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod # customize as desired
spec:
  acme:
    # You must replace this email address with your own.
    # Let's Encrypt will use this to contact you about expiring
    # certificates, and issues related to your account.
    email: user@example.com
    server: https://acme-v02.api.letsencrypt.org/directory
    privateKeySecretRef:
      # Secret resource that will be used to store the issuer account's private key.
      name: acme_prod_issuer_key # customize as desired
    # Add a single challenge solver, HTTP01 using nginx-ingress
    solvers:
    - http01:
        ingress:
          ingressClassName: nginx
```

Then apply it:

```bash
kubectl apply -f issuer.yaml
```

Here we use the Let's Encrypt's production environment, which imposes [rate limits](https://letsencrypt.org/docs/rate-limits/). If you are afraid of reaching these limitations, you can start by using the staging environment, by using this URL instead: `https://acme-staging-v02.api.letsencrypt.org/directory`. To move to production afterwards, simply create a new Issuer with the URL mentionned above. More info on this [here](https://cert-manager.io/docs/tutorials/acme/http-validation/#issuing-an-acme-certificate-using-http-validation). More info on ACME issuer [here](https://cert-manager.io/docs/configuration/acme/).

## OAuth2 proxy install & config

We assume that you expose your app under `destine.example.com/yourProject/`. Make sure you replace each mention of it with your actual domain/path.

You need to grab your `clientID` and `clientSecret` of the OIDC client created earlier. You can find them on [this page](https://auth.destine.eu/admin/desp/console/#/desp/clients/).
If you have several clients there, you need to install one instance of OAuth2 proxy for each one.

Click on your client. `clientID` is in the first tab. In the tab `Credentials`, choose `client id and secret` for the field `Client Authenticator` and generate your client secret if it doesn't exist yet.

We also need to create a cookie secret that will be used below, using to the following command:

```bash
dd if=/dev/urandom bs=32 count=1 2>/dev/null | base64 | tr -d -- '\n' | tr -- '+/' '-_' ; echo
```

(optional) Create a kubernetes namespace for the OAuth2-proxy instance :
`kubectl create ns oauth2-desp`

We will use the official [oauth2-proxy Helm chart](https://github.com/oauth2-proxy/manifests) to install it on the cluster:

Add oauth2-proxy Helm repository:

```bash
helm repo add oauth2-proxy https://oauth2-proxy.github.io/manifests 
helm repo update
```

Install oauth2-proxy Helm chart:
```bash
helm install \
  oauth2-proxy-desp-yourProject \ # choose whatever name you want
  oauth2-proxy/oauth2-proxy \ # name of the Helm chart, should not change
  -f desp-values.yaml \ # configuration file to create beforehand, see later
  -n oauth2-desp # name of the namespace where oauth2-proxy should be deployed
```

Here is an example of `desp-values.yaml`:

```yaml
# Oauth client configuration specifics
config:
  clientID: "<the clientID you grabbed earlier>"
  clientSecret: "<the clientSecret you grabbed earlier>"
  cookieSecret: "<the cookie secret you created earlier>"
  configFile: |-
    oidc_email_claim="sub"
    email_domains = [ "*" ]
    upstreams = [ "file:///dev/null" ]
    provider = "keycloak-oidc"
    oidc_issuer_url = "https://auth.destine.eu/realms/desp"
    proxy_prefix = "/yourProject/oauth2"
    oidc_extra_audiences = [ "azp" ]
    oidc_groups_claim = "group"
    scope = "openid"
    cookie_domains = [ ".example.com" ]
    cookie_refresh = "1m"
    cookie_expire = "30m"
    whitelist_domains = [ ".example.com" ]
    set_authorization_header = true
    set_xauthrequest = true
    pass_authorization_header = true
    pass_access_token = true
    pass_user_headers = true
    code_challenge_method = "S256"
    show_debug_on_error = true
    upstream_timeout = "600s"
    cookie_samesite = "none"

extraArgs:
  oidc-audience-claim: "azp"

ingress:
  enabled: true
  className: "nginx"
  annotations:
    cert-manager.io/cluster-issuer: acme_prod_issuer_key 
  path: /yourProject/oauth2 # change the /yourProject prefix to fit with where the app will be exposed
  pathType: Prefix
  hosts:
    - destine.example.com # change to fit with you own hostname
  tls:
    - secretName: cert-destine.example.com # a k8s secret with this name will be generated by cert-manager in the oauth2-desp namespace
    hosts:
    - destine.example.com

sessionStorage:
  type: cookie
```

## Deployment of your app

To expose your application to the outside, you need to create an Ingress resource on your cluster.

This Ingress resource should be configured to rely on the installed instance of oauth2-proxy for authentication.

Here is an example of ingress that will use the OAuth2-proxy:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  annotations:
    cert-manager.io/cluster-issuer: acme_prod_issuer_key # corresponds to the name of the issuer created earlier
    nginx.ingress.kubernetes.io/auth-url: https://destine.example.com/yourProject/oauth2/auth
    nginx.ingress.kubernetes.io/auth-signin: https://destine.example.com/yourProject/oauth2/start?rd=https://destine.example.com/yourProject/ # the rd query string provides the location where the user will be redirected after the authentication has succeeded.
    nginx.ingress.kubernetes.io/auth-response-headers:
      x-auth-request-user, x-auth-request-email, x-auth-request-groups, X-Forwarded-Preferred-Username, X-Auth-Request-Access-Token
  name: <app_name> # customize as desired
  namespace: <app_namespace> # customize as desired
spec:
  ingressClassName: nginx
  rules:
  - host: destine.example.com
    http:
      paths:
      - path: /yourProject/
        pathType: Prefix
        backend:
          service:
            name: <service_name> # must stick with the name of the corresponding Service k8s object
            port:
              number: 80
  tls:
  - hosts:
    - destine.example.com
    secretName: cert-destine.example.com
```

Don't forget to create your deployment as well if it hasn't been done already.

After that, your application should be accessible at `https://destine.example.com/yourProject/`, and you should be redirected to the DESP login page if not yet authenticated.
