function addPacket() {
    let newRow = document.getElementById("js-template-row").cloneNode(true);
    newRow.removeAttribute("style");
    newRow.removeAttribute("id");
    let table = document.getElementById("js-table-seed-edit");
    table.append(newRow);
}

async function deletePacket(packetId) {
    const response = await fetch('/deletepacket?packet_id=' + packetId, {method: 'DELETE'});
    window.location.reload();
}

//document.querySelector(".js-today").valueAsDate = new Date();
