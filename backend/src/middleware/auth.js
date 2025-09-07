import jwt from "jsonwebtoken";

// 🔐 Protect routes (JWT verification)
export function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No token provided" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Token missing" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, role }
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}

// 🎯 Role-based access control
export function requireRole(allowedRoles) {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ error: "Unauthorized" });

        // Normalize allowedRoles to always be an array
        if (!Array.isArray(allowedRoles)) allowedRoles = [allowedRoles];

        if (!allowedRoles.includes(req.user.role) && req.user.role !== "admin") {
            return res.status(403).json({ error: "Forbidden: Insufficient permissions" });
        }

        next();
    };
}
