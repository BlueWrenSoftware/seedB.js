/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var seed_groups = []
var app = new Vue({
el: '#app',
data: {seed_groups: []} 
});
var db = null;

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

function add_seed_group(transaction, id_seed_group, seed_group, group_description, id_user) {
    transaction.executeSql(
            `INSERT INTO SeedGroups (id_seed_group, 
                                                          seed_group,
                                                          group_description,
                                                          id_user)  
                   VALUES (?,?,?,?)`,
        [id_seed_group, seed_group, group_description, id_user]);
}

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    // document.getElementById('deviceready').classList.add('ready');
    db = window.sqlitePlugin.openDatabase({name: 'seed.db', location: 'default'}, function(db) {
console.log('Connected to DB')}, function(err) {console.log('Open db error: ' +JSON.stringify(err));});
    db.transaction(function(tr) {
        tr.executeSql('DROP TABLE IF EXISTS SeedGroups');
        tr.executeSql(`CREATE TABLE IF NOT EXISTS SeedGroups (
	                            id_seed_group	INTEGER,
	                            seed_group	TEXT,
	                            group_description	TEXT,
	                            id_user	TEXT NOT NULL,
	                            PRIMARY KEY(id_seed_group AUTOINCREMENT))`
                     );
        add_seed_group(tr, 1,'flower','update','adm');
        add_seed_group(tr, 2,'vegetable','update','adm');
        add_seed_group(tr,3,'fruit','update','adm');
        add_seed_group(tr,4,'herb','update','adm');
        add_seed_group(tr,5,'ornamental','update','adm');
    },
                   function(tx, error) {
                       console.log(error.message);},
                   function () {console.log('ok');}
                  );
    db.transaction(function(tr) {
        tr.executeSql(
            'SELECT DISTINCT seed_group FROM SeedGroups',
            [],
            function(tr, rs) {
                for (i=0; i<rs.rows.length; i++) {
                    app.seed_groups.push(rs.rows.item(i).seed_group);
                }
            },
            function(tx, error) {
                console.log(error.message);},
            function (error) { console.log(error.message);},
            function () {console.log('ok');}
        );
    }
                  );
     
}
