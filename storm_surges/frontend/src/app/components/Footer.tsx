// src/app/components/Footer.tsx

"use client";

import Image from "next/image";
import React, { useState } from "react";

const Footer = () => {
  const basePath = process.env.BASEPATH || "";
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <>
      <footer
        style={{
          backgroundColor: "#0D1527",
          display: "flex",
          paddingTop: "6px",
          paddingBottom: "6px",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "auto",
          color: "white",
        }}
      >
        <div>
          <Image
            src={basePath + "/ipcc.png"}
            alt="Ipcc Logo"
            width={40}
            height={60}
            style={{ cursor: "pointer" }}
            onClick={openModal}
          />
        </div>
        <Image
          src={basePath + "/sistemaLogo.png"}
          alt="sistema gmbh"
          width={80}
          height={80}
          style={{ cursor: "pointer" }}
          onClick={() =>
            window.open(
              "https://www.sistema.at/",
              "_blank",
              "noopener,noreferrer"
            )
          }
        />
      </footer>

      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={closeModal}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              maxWidth: "600px",
              maxHeight: "80vh",
              overflowY: "auto",
              color: "black",
            }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            <h2>
              <b>Acknowledgments</b>
            </h2>
            <p className="text-sm">
              We thank the projection authors for developing and making the
              sea-level rise projections available, multiple funding agencies
              for supporting the development of the projections, and the NASA
              Sea Level Change Team for developing and hosting the IPCC AR6 Sea
              Level Projection Tool.
            </p>
            <ul>
              <li>
                <p className="text-xs mt-4">
                  Fox-Kemper, B., H.T. Hewitt, C. Xiao, G. Aðalgeirsdóttir, S.S.
                  Drijfhout, T.L. Edwards, N.R. Golledge, M. Hemer, R.E. Kopp,
                  G. Krinner, A. Mix, D. Notz, S. Nowicki, I.S. Nurhati, L.
                  Ruiz, J.-B. Sallée, A.B.A. Slangen, and Y. Yu, 2021: Ocean,
                  Cryosphere and Sea Level Change. In{" "}
                  <i>Climate Change 2021: The Physical Science Basis</i>.
                  Contribution of Working Group I to the Sixth Assessment Report
                  of the Intergovernmental Panel on Climate Change.{" "}
                  <a
                    href="https://doi.org/10.1017/9781009157896.011"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#0000EE", textDecoration: "underline" }}
                  >
                    doi:10.1017/9781009157896.011
                  </a>
                </p>
              </li>
              <p className="text-xs mt-2">
                Kopp, R. E., Garner, G. G., Hermans, T. H. J., Jha, S., Kumar,
                P., Reedy, A., Slangen, A. B. A., Turilli, M., Edwards, T. L.,
                Gregory, J. M., Koubbe, G., Levermann, A., Merzky, A., Nowicki,
                S., Palmer, M. D., & Smith, C. (2023). The Framework for
                Assessing Changes To Sea-Level (FACTS) v1.0: A platform for
                characterizing parametric and structural uncertainty in future
                global, relative, and extreme sea-level change.{" "}
                <i>Geoscientific Model Development</i>, 16, 7461–7489.{" "}
                <a
                  href="https://doi.org/10.5194/gmd-16-7461-2023"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#0000EE", textDecoration: "underline" }}
                >
                  https://doi.org/10.5194/gmd-16-7461-2023
                </a>
              </p>
              <p className="text-xs mt-2">
                Garner, G. G., T. Hermans, R. E. Kopp, A. B. A. Slangen, T. L.
                Edwards, A. Levermann, S. Nowicki, M. D. Palmer, C. Smith, B.
                Fox-Kemper, H. T. Hewitt, C. Xiao, G. Aðalgeirsdóttir, S. S.
                Drijfhout, T. L. Edwards, N. R. Golledge, M. Hemer, G. Krinner,
                A. Mix, D. Notz, S. Nowicki, I. S. Nurhati, L. Ruiz, J-B.
                Sallée, Y. Yu, L. Hua, T. Palmer, B. Pearson, 2021.{" "}
                <i>IPCC AR6 Sea Level Projections</i>. Version 20210809. Dataset
                accessed at{" "}
                <a
                  href="https://doi.org/10.5281/zenodo.5914709"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#0000EE", textDecoration: "underline" }}
                >
                  https://doi.org/10.5281/zenodo.5914709
                </a>
              </p>
            </ul>
            <button
              onClick={closeModal}
              style={{
                marginTop: "10px",
                padding: "8px 16px",
                backgroundColor: "#0D1527",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
