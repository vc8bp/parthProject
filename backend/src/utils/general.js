
export const userRoles = {
    "employee": [],
    "hr": ["employee"],
    "admin": ["hr", "employee"],
    "superadmin": ["superadmin", "admin", "hr", "employee"]
}
export const whoCanViewEmployeeDetails = ["admin", "superadmin"]

