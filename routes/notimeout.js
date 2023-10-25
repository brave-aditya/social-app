import  express  from "express";

const router = express.Router();

const notimefunction = (req,res) => {
    res.status(200).json("Counter has been updated and not sleeping")
}

router.get("", notimefunction);

export default router;