const endUser = require("../models/EndUser");
const { getProject } = require("../utils/projects");
const { hashPassword, comparePassword } = require("../utils/hash");
const { signToken, verifyToken } = require("../utils/jwt");

const signup = async (req, res) => {
  try {
    const { project_id, email, password } = req.body;
    if (!project_id || !email || !password)
      return res
        .status(400)
        .json({ error: "project_id, email, password required" });

    // Verify project exists via accounts service
    console.log("Fetching project:", project_id);
    const project = await getProject(project_id);
    if (!project) return res.status(404).json({ error: "project not found" });

    const passwordHash = await hashPassword(password);
    const user = await endUser.create({
      projectId: project_id,
      email,
      passwordHash,
    });

    const token = signToken({
      user_id: user.id,
      project_id,
      email: user.email,
      role: user.role,
    });

    return res
      .status(201)
      .json({ token, user: { id: user.id, email: user.email, project_id } });
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return res
        .status(409)
        .json({ error: "email already registered for this project" });
    }
    console.error(err);
    return res.status(500).json({ error: "internal" });
  }
};

const login = async (req, res) => {
  try {
    const { project_id, email, password } = req.body;
    if (!project_id || !email || !password)
      return res
        .status(400)
        .json({ error: "project_id, email, password required" });

    const project = await getProject(project_id);
    if (!project) return res.status(404).json({ error: "project not found" });

    const user = await endUser.findOne({
      where: { projectId: project_id, email },
    });
    if (!user) return res.status(401).json({ error: "invalid credentials" });

    const ok = await comparePassword(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "invalid credentials" });

    const token = signToken({
      user_id: user.id,
      project_id,
      email: user.email,
      role: user.role,
    });

    return res.json({
      token,
      user: { id: user.id, email: user.email, project_id },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal" });
  }
};

const verify = async (req, res) => {
  try {
    res.set("Cache-Control", "no-store");
    res.set("Pragma", "no-cache");
    const auth = req.headers.authorization || "";
    const m = auth.match(/^Bearer (.+)$/);
    if (!m) return res.status(401).end();

    const token = m[1];
    let payload;
    try {
      payload = verifyToken(token);
    } catch (err) {
      return res.status(401).json({ success: false, message: "invalid token" });
    }

    const headerProject = req.headers["x-project-id"];
    if (!headerProject)
      return res
        .status(400)
        .json({ success: false, message: "missing x-project-id header" });
    if (headerProject !== payload.project_id) {
      return res
        .status(401)
        .json({ success: false, message: "project mismatch" });
    }

    res.set({
      "X-Auth-User-Id": payload.user_id,
      "X-Auth-Project-Id": payload.project_id,
      "X-Auth-Role": payload.role || "user",
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "internal error" });
  }
};

module.exports = { signup, login, verify };
