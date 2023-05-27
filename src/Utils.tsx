import { TabletopOutput } from "./Tabletop";

export function downloadPrompt(fileName: string, output: TabletopOutput) {
    // Download prompt
    var jsonse = JSON.stringify(output);
    var blob = new Blob([jsonse], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');

    document.body.appendChild(a);
    a.href = url;
    a.download = fileName;
    a.click();

    //Cleanup
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

const punctRE = /[\\'!"#$%&()*+,\-.:;<=>?@[\]^_`{|}~]/g;

export function getNumInstances(line: string) {
    let numInstances = Number(line.split(" ")[0])
    if (isNaN(numInstances)) {
        return 1;
    }
    return numInstances;
}

export function getName(line: string) {
    // Starts with number
    if (line.match(/^\d/)) {
        let separated = line.split(" ");
        return separated.slice(1).join(" ").trim().toLowerCase().replace(punctRE, '');
    }
    return line.trim().toLowerCase().replace(punctRE, '');
}

export function isValidHttpUrl(str: string): boolean {
    var res = str.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g);
    if(res == null)
        return false;
    else
        return true;
}