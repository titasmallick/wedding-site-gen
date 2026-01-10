"use client";

import { useEffect, useState } from "react";
import * as faceapi from "face-api.js";

interface FaceRecognitionProps {
  file: File | null;
  onFacesDetected?: (detections: any[]) => void;
  onProcessingStatus?: (status: boolean | string) => void;
}

export default function FaceRecognition({
  file,
  onFacesDetected,
  onProcessingStatus,
}: FaceRecognitionProps) {
  const [modelsLoaded, setModelsLoaded] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";

      try {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        setModelsLoaded(true);
        console.log("FaceAPI models loaded");
      } catch (error) {
        console.error("Error loading FaceAPI models:", error);
      }
    };

    loadModels();
  }, []);

  useEffect(() => {
    const detectFaces = async () => {
      if (!file) return;

      if (!modelsLoaded) {
        onProcessingStatus?.("Loading AI Models...");
        return;
      }

      onProcessingStatus?.("Scanning for Faces...");

      const imageUrl = URL.createObjectURL(file);
      const img = document.createElement("img");

      img.src = imageUrl;
      img.crossOrigin = "anonymous";

      img.onload = async () => {
        try {
          const detections = await faceapi
            .detectAllFaces(img)
            .withFaceLandmarks()
            .withFaceDescriptors();

          console.log("Face Detection Results:", detections);

          if (onFacesDetected) {
            // Serialize the complex FaceAPI objects into plain JS objects for Firestore
            // We explicitely map fields to ensure no class instances remain
            const serializedDetections = detections.map((d) => {
              const plainObject = {
                detection: {
                  score: d.detection.score,
                  box: {
                    x: d.detection.box.x,
                    y: d.detection.box.y,
                    width: d.detection.box.width,
                    height: d.detection.box.height,
                  },
                },
                landmarks: d.landmarks.positions.map((p) => ({
                  x: p.x,
                  y: p.y,
                })),
                descriptor: Array.from(d.descriptor),
              };

              // Double safety: remove any prototype links
              return JSON.parse(JSON.stringify(plainObject));
            });

            onFacesDetected(serializedDetections);
          }
        } catch (error) {
          console.error("Error detecting faces:", error);
        } finally {
          URL.revokeObjectURL(imageUrl);
          onProcessingStatus?.(false);
        }
      };
    };

    detectFaces();
  }, [file, modelsLoaded, onFacesDetected]);

  return null; // This component doesn't render anything visible
}
