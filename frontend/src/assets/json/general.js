export const LeaveTypes = ['Sick Leave', 'Vacation', 'Personal Leave', 'Other']

export const statusColorMap = {
    Pending: "geekblue",
    Approved: "green", 
    Rejected: "volcano"
}
export const roleMap = {
    'hr': 'purple',
    'superadmin': 'gold',
    'admin': 'cyan',
    'employee': 'blue',
};

export const userPermissionMap = {
    "employee": [],
    "hr": ["employee"],
    "admin": ["hr", "employee"],
    "superadmin": ["superadmin", "admin", "hr", "employee"]
}

export const userNameToNumberMap = {
    user: 0,
    admin: 1,
}
export const userNumberToName = {
    0 : "user",
    1 : "admin",
}