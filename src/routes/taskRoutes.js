import express from "express";
import Task from "../models/Task.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply auth middleware
router.use(authMiddleware);

// POST /api/tasks
router.post("/", async (req, res) => {
  try{
    // - Create task
    const {title,description} = req.body;

    if(!title){
      return res.status(400).json({message:"Please provide a title"});
    }

    const task = new Task({
      title,
      description,
      userId:req.user.userId
    });

    await task.save();

    res.status(201).json({
      message:"Task succesfully created",
      task
    })
    // - Attach owner = req.user._id

  }
  catch(err){
    console.error(err);
    return res.status(500).json({message:"Server error"});
  }
});

// GET /api/tasks
router.get("/", async (req, res) => {
  // - Return only tasks belonging to req.user
  try{
    const tasks = await Task.find({userId:req.user.userId});
    res.json(tasks);
  }
  catch(err){
    console.error(err);
  }
});



// DELETE /api/tasks/:id
router.delete("/:id", async (req, res) => {
  // - Check ownership
  // - Delete task

  try{
    const id = req.params.id;
    const task = await Task.findByIdAndDelete({_id:id,user:req.user.userId});

    if(!task){
      return res.status(404).json({message:"Task not found"});
    }

    res.json({message:"Task deleted successfully"});
  }catch(err){}
});

export default router;