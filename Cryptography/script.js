// Encryption

//caesar
function caesarCipher(text, shift) {
    const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";

    for (let i = 0; i < text.length; i++) {
        let char = text.charAt(i);
        let charCode = char.charCodeAt(0);

        if (/[a-zA-Z]/.test(char)) {
            let newCharCode = charCode + shift;
            if (newCharCode > 122) {
                newCharCode -= 26;
            } else if (newCharCode < 65) {
                newCharCode += 26;
            }
            result += String.fromCharCode(newCharCode);
        } else {
            result += char;
        }
    }

    return result;
}

//morse

function morseCode(text, isEncrypt = true) {
    const morseCodeDictionary = {
        "A": ".-", "B": "-...", "C": "-.-.", "D": "-..", "E": ".", "F": "..-.", "G": "--.", "H": "....", "I": "..", "J": ".---", "K": "-.-", "L": ".-..", "M": "--", "N": "-.", "O": "---", "P": ".--.", "Q": "--.-", "R": ".-.", "S": "...", "T": "-", "U": "..-", "V": "...-", "W": ".--", "X": "-..-", "Y": "-.--", "Z": "--.."
    };
    const reverseDictionary = {};
    for (const key in morseCodeDictionary) {
        reverseDictionary[morseCodeDictionary[key]] = key;
    }

    let result = "";

    for (let i = 0; i < text.length; i++) {
        const char = text.charAt(i).toUpperCase();
        if (isEncrypt) {
            if (morseCodeDictionary.hasOwnProperty(char)) {
                result += morseCodeDictionary[char] + " ";
            } else {
                result += char;
            }
        } else {
            const words = text.trim().split(" ");
            for (const word of words) {
                if (reverseDictionary.hasOwnProperty(word)) {
                    result += reverseDictionary[word];
                } else {
                    result += word + " ";
                }
            }
        }
    }
    return isEncrypt ? result.trim() : result;
}


const encryptButton = document.getElementById("encryptButton");
const resultMessage = document.getElementById("resultMessage");

encryptButton.addEventListener("click", function () {
    const plainText = document.getElementById("plainText").value;
    const cipher = document.getElementById("cipher").value;
    let result;

    if (cipher === "caesar") {
        result = caesarCipher(plainText, 13);

        document.getElementById("audioContainer").style.display = "none";
    } 
     else {
        cipher === "morse";
        result = morseCode(plainText);
        document.getElementById("audioContainer").style.display = "flex";
    }
    resultMessage.textContent = result;
});

// Decryption

const decryptButton = document.getElementById("decryptButton");

decryptButton.addEventListener("click", function () {
    const encryptedText = document.getElementById("encryptedMessage").value;
    const result = decrypt(encryptedText);
    document.getElementById("outputMessage").textContent = result;
});

function decrypt(text) {
    if (/[.-]/.test(text)) {
        
        return morseDecode(text);
    } else {
       
        return caesarDecrypt(text);
    }
}


function morseDecode(text) {
    const morseCodeDictionary = {
        ".-": "A", "-...": "B", "-.-.": "C", "-..": "D", ".": "E", "..-.": "F",
        "--.": "G", "....": "H", "..": "I", ".---": "J", "-.-": "K", ".-..": "L",
        "--": "M", "-.": "N", "---": "O", ".--.": "P", "--.-": "Q", ".-.": "R",
        "...": "S", "-": "T", "..-": "U", "...-": "V", ".--": "W", "-..-": "X",
        "-.--": "Y", "--..": "Z",
        "-----": "0", ".----": "1", "..---": "2", "...--": "3", "....-": "4",
        ".....": "5", "-....": "6", "--...": "7", "---..": "8", "----.": "9"
    };
    const words = text.trim().split(" ");
    let result = "";

    for (const word of words) {
        if (morseCodeDictionary.hasOwnProperty(word)) {
            result += morseCodeDictionary[word];
        } else {
            result += " ";
        }
    }

    return result;
}

function caesarDecrypt(text) {
    const alphabetLower = "abcdefghijklmnopqrstuvwxyz";
    const alphabetUpper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";

    for (let i = 0; i < text.length; i++) {
        let char = text[i];
        let isLower = /[a-z]/.test(char);
        let isUpper = /[A-Z]/.test(char);

        if (isLower) {
            let index = alphabetLower.indexOf(char);
            let newIndex = (index - 13 + 26) % 26;
            result += alphabetLower[newIndex];
        } else if (isUpper) {
            let index = alphabetUpper.indexOf(char);
            let newIndex = (index - 13 + 26) % 26;
            result += alphabetUpper[newIndex];
        } else {
            result += char;
        }
    }

    return result;
}

// morse audio 
playAudioButton.addEventListener("click", function () {
    const morseText = document.getElementById("resultMessage").value;
    const audioContext = new AudioContext();

    const oscillator = audioContext.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime);

    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();

    // time duration for different . , -, & space
    const dotDuration = 100;
    const dashDuration = 3 * dotDuration;
    const spaceDuration = 0 * dotDuration;

    const morseCodeDictionary = {
        ".": [dotDuration, dotDuration],
        "-": [dashDuration, dotDuration],
        " ": [spaceDuration, dotDuration]
    };

    let time = audioContext.currentTime;
    for (let i = 0; i < morseText.length; i++) {
        const char = morseText[i];
        const signal = morseCodeDictionary[char];
        if (signal) {
            oscillator.frequency.setValueAtTime(880, time);
            gainNode.gain.setValueAtTime(1, time);
            time += signal[0] / 1000;
            gainNode.gain.setValueAtTime(0, time);
            time += signal[1] / 1000;
        } else {
            time += spaceDuration / 1000;
        }
    }

    oscillator.stop(time);
});
