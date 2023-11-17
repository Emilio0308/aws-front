import axios from "axios";

export const backendconfig = axios.create({
  // baseURL: "https://api-gateway-g8ad.onrender.com/apigateway/v1/",
  baseURL: "http://localhost:3000/apigateway/v1/",
});

export const startservices = () => {
  const services = [
    "https://user-service-aav2.onrender.com",
    "https://email-service-x8gr.onrender.com",
    "https://chat-service-qa46.onrender.com",
    "https://call-service-uxn7.onrender.com",
  ];

  services.forEach((url) => {
    axios
      .get(url)
      .then((res) => res.data)
      .catch((err) => console.log(err));
  });
};
