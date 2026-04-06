"use client";

import { useEffect } from "react";

// config
const SNOWFLAKE_COUNT = 150;
const SNOW_COLORS = [
    "radial-gradient(circle at top left,#dcf2fd,#60b4f2)",
    "#dbf2fd",
    "#d8f8ff",
    "#b8ddfa",
];

export function SnowEffect() {
    useEffect(() => {
        const CONTAINER_ID = "custom-snow-effect";

        if (document.getElementById(CONTAINER_ID)) {
            return;
        }

        const getRandomInt = (min: number, max: number) =>
            Math.floor(Math.random() * (max - min + 1)) + min;

        const getRandomColor = () =>
            SNOW_COLORS[Math.floor(Math.random() * SNOW_COLORS.length)];

        let cssStyles = `
      #${CONTAINER_ID} {
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        z-index: 1;
        pointer-events: none;
      }
      .snowflake-particle {
        position: absolute;
        width: 10px;
        height: 10px;
        background: white;
        border-radius: 50%;
        margin-top: -10px;
      }
    `;

        let htmlContent = "";

        for (let i = 1; i <= SNOWFLAKE_COUNT; i++) {
            htmlContent += '<i class="snowflake-particle"></i>';

            const startX = (getRandomInt(0, 10000) / 100).toFixed(2);
            const xOffset = (getRandomInt(-10, 10)).toFixed(2);
            const bounceHeight = (getRandomInt(30, 80)).toFixed(2);
            const scale = (getRandomInt(30, 100) / 100).toFixed(2);
            const duration = getRandomInt(10, 30);
            const delay = getRandomInt(0, 30);
            const opacity = (getRandomInt(40, 100) / 100).toFixed(2);
            const color = getRandomColor();

            cssStyles += `
          .snowflake-particle:nth-child(${i}) {
            background: ${color};
            opacity: ${opacity};
            transform: translate(${startX}vw, -10px) scale(${scale});
            animation: fall-animation-${i} ${duration}s -${delay}s linear infinite;
          }

          @keyframes fall-animation-${i} {
            ${bounceHeight}% {
              transform: translate(${parseFloat(startX) + parseFloat(xOffset)}vw, ${bounceHeight}vh) scale(${scale});
            }
            to {
              transform: translate(${parseFloat(startX) + parseFloat(xOffset) / 2}vw, 105vh) scale(${scale});
            }
          }
        `;
        }

        const snowContainer = document.createElement("div");
        snowContainer.id = CONTAINER_ID;

        const styleElement = document.createElement("style");
        styleElement.textContent = cssStyles;

        snowContainer.appendChild(styleElement);
        snowContainer.innerHTML += htmlContent;

        document.body.appendChild(snowContainer);

        // cleanup
        return () => {
            const existingSnow = document.getElementById(CONTAINER_ID);
            if (existingSnow) {
                existingSnow.remove();
            }
        };
    }, []);

    return null;
}
