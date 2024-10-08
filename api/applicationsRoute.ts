const router = require("express").Router();
import * as applicationController from "../controllers/jobApplicationContoller";

// v1/api/applications

router.get("/", applicationController.getActiveJobApplications);
router.post("/active", applicationController.createJobApplication);
router.get(
  "/not-active",
  applicationController.getNoLongerConsideringApplications
);
router.put("/:id", applicationController.updateJobApplication);

export default router;
