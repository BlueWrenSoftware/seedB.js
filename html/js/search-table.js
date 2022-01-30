function searchFunction(colId) {
    var input, filter, table, tr, td, i, txtValue, col, colId;
    input = document.getElementById("js-search-input-seeds");
    filter = input.value.toUpperCase();
    table = document.getElementById("js-search-table-seeds");
    tr = table.getElementsByTagName("tr");
    headers = table.getElementsByTagName("th");
    searchCol = document.getElementById(colId);
    for (i = 0; i < headers.length; i++) {
        if (headers[i] === searchCol) {
            col = i;
            break;
        }
    }
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[col];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }       
    }
}

function toggle() {
    var off=document.getElementById("js-search-table-seeds");
    if (off.style.display == "none") {
        off.style.display = "";
    } else {
        off.style.display = "none";
    }        
}
