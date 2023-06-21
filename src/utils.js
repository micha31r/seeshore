// Join paths (Rob M., 2015)
// https://stackoverflow.com/questions/29855098/is-there-a-built-in-javascript-function-similar-to-os-path-join
export function joinPaths (parts, sep='/') {
  return parts.join(sep).replace(new RegExp(sep+'{1,}', 'g'), sep)
}


// Convert file to base64 (Дмитрий Васильев, 2019)
// https://stackoverflow.com/questions/36280818/how-to-convert-file-to-base64-in-javascript
export function toBase64 (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  })
}

// Check if string is valid URL (Vikram Aruchamy, 2022)
// https://www.freecodecamp.org/news/check-if-a-javascript-string-is-a-url/
export function isValidURL (string) {
  const element = document.createElement('input')
  element.type = 'url'
  element.value = string
  return element.checkValidity()
} 