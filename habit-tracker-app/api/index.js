const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const port = 3000;
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

mongoose.connect("mongodb+srv://rohanrawat7508:Rohan7508@cluster0.ilfiiql.mongodb.net/").then(()=>{
  console.log("Mongo db connected to project")
}).catch((err)=>
console.log("Error white connecting to mongoDb - ", err));

app.listen(port, ()=>{
  console.log("Server running on port - ", port)
})

//endpoint to create a habit in backend

const Habit = require("./modals/habit")
app.post("/create-habit", async (req, res) => {
  try {
    const {title, color, repeatMode, reminder} = req.body;

    const newHabit = new Habit({
      title,
      color,
      repeatMode,
      reminder,
    })

    //save to backend
    const savedhHabit = await newHabit.save();
    res.status(200).json(savedhHabit);
  } catch (error) {
    res.status(500).json({error: "Network error occured"})
  }
})

//endpoint to fecth list of habits in backend

app.get("/habitsList", async (req, res) => {
  try {
    const habitsList = await Habit.find({});
    res.status(200).json(habitsList);
  } catch (error) {
    res.status(500).json({error: "Error occured while fetching habits"});
  }
});

app.put("/create-habit/:habitId/completed", async (req, res) => {
  const habitId = req.params.habitId;
  const updatedCompletion = req.body.completed;
  try {
    const updatedHabit = await Habit.findByIdAndUpdate(
      habitId,
      {completed: updatedCompletion},
      {new: true},
    );

    if (!updatedHabit) {
      return res.status(404).json({error: "Habit not found"});
    }
    res.status(200).json(updatedHabit);

  } catch (error) {
    res.status(500).json({error: "Error occured while updating habit completion"});
  }
});


app.delete("/create-habit/:habitId", async (req, res) => {
  try {
    const {habitId}= req.params;
    await Habit.findByIdAndDelete(habitId);
    res.status(200).json({message:"Habit deleted successfully"});
  } catch (error) {
    res.status(500).json({error: "Error occured while deleting habit"});
  }
})