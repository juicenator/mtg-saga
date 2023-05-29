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

export function isValidHttpUrl(str: string): boolean {
    var res = str.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g);
    if (res == null)
        return false;
    else
        return true;
}
