import "reflect-metadata";
import express from "express";
import AppDataSource from "./data-source";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });
