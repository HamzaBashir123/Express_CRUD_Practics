import express from "express";
import fs from "fs";
// import { json } from 'stream/consumers';

const app = express();
const PORT = 8000;

const profileData = fs.readFileSync("./tours.json", "utf-8");

// console.log(profileData)
const parseProfileData = JSON.parse(profileData);
// console.log(parseProfileData.data[parseProfileData.data.length-1].id);

app.use(express.json());

app.get("/dashboard/:tourId", (req, res) => {
  console.log(req.params.tourId, "==>>params");
  console.log(typeof req.params.tourId, "==>>typeof");
  console.log(parseProfileData?.data.length, "==>>length");

  if (req.params.tourId * 1 > parseProfileData?.data.length) {
    return res.status(404).send("Data not available");
  }

  const singleTour = parseProfileData?.data?.find(
    (tour) => tour.id == req.params.tourId
  );

  console.log(singleTour, "===>> singleTour");

  res.status(200).json({
    status: "success",
    data: singleTour,
  });
});
app.post("/profiles", (req, res) => {
  console.log(req.body);

  if (
    !req.body.fullName ||
    !req.body.mail ||
    !req.body.gender ||
    !req.body.age ||
    !req.body.phoneNumber
  ) {
    res.status(400).send({
      status: "Rejected",
      data: "Missing Fields",
    });
  }
  const dataPushId = {
    id: parseProfileData.data[parseProfileData.data.length - 1].id + 1,
    ...req.body,
  };
  parseProfileData.data.push(dataPushId);
  fs.writeFile("./tours.json", JSON.stringify(parseProfileData), () => {
    res.status(200).send({
      status: "Success",
      data: "Data added Successfully",
    });
  });
});

app.delete("/profile/:personId", (req, res) => {
  console.log(req.params.personId);
  const filterData = parseProfileData.data.filter((tour) => tour.id != (req.params.personId * 1));
  parseProfileData.data = filterData;
  fs.writeFile("./tours.json", JSON.stringify(parseProfileData), () => {
    res.status(200).send({
      status: "Success",
      data: "Data added Successfully",
    });
  });
});

app.put("/profile/:personId", (req, res) => {
    console.log(req.params.personId)

    let indexNumber;

    parseProfileData.data.forEach((tour, idx) => {
        if (tour.id === (req.params.personId * 1)) {
            indexNumber = idx
        }
    })
    const datatoWriteInDb = {
        id: req.params.personId ,
        ...req.body
    }

    parseProfileData.data.splice(indexNumber, 1, datatoWriteInDb)

    // parseProfileData.data.splice()

    fs.writeFile('./tours.json', JSON.stringify(parseProfileData), () => {
        res.status(200).send({
            status: "success",
            data: "Update Successfully"
        })
    })
})



app.listen(PORT, () => {
  console.log(`Server running on port number ${PORT}`);
});
