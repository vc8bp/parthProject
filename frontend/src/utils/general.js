export const getLocalStorage = (name, def, isJson = true) => {
    const storage = localStorage.getItem(name)
    if(storage){
        return isJson ? JSON.parse(storage) : storage
    } else return def
}

export function exportDataToCSV(data, filename) {
    const columns = Object.keys(data[0]).map(col => col);
  
    const csvContent = "data:text/csv;charset=utf-8," + columns.join(",") + "\n" + data.map(item => columns.map(column => item[column] || "").join(",")).join("\n");
  
    const encodedUri = encodeURI(csvContent);
  
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


export const formateDate = (date, formate) => {
    if(formate) return new Date(date).toDateString() 
    return new Date(date)
}


export const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onloadend = () => {
        if (reader.readyState === FileReader.DONE) {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert image to base64'));
        }
      };
  
      reader.readAsDataURL(file);
    });
  };
