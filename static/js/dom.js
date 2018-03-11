let dom = {
    loadTable: function () {
        dataHandler.getPlanets(dom.showTable)
    },
    showTable: function (url) {
        let container = document.getElementById('container');
        // clear container
        container.innerHTML = '';

        // page nav buttons div
        let navDiv = document.createElement('DIV');
        navDiv.setAttribute('id', 'pageNavButtons');

        // creating page nav buttons, disabled in default
        function createPageNavButton(direction) {
                let navButton = document.createElement('BUTTON');
                navButton.setAttribute('class', 'btn btn-link');
                navButton.setAttribute('id', `${direction}`);
                navButton.setAttribute('disabled', '');
                navButton.innerText = direction;
                navDiv.appendChild(navButton);
        }
        createPageNavButton('Previous');
        createPageNavButton('Next');
        container.appendChild(navDiv);

        // creating table with header
        let table = document.createElement('TABLE');
        table.setAttribute('class', 'table table-striped');
        let tableTitles = ['Name', 'Diameter', 'Climate', 'Terrain',
            'Surface water percentage', 'Population', 'Residents', ''];
        let tr = document.createElement('TR');
        tableTitles.forEach(function (title) {
            let th = document.createElement('TH');
            th.setAttribute('scope', 'col');
            th.innerText = title;
            tr.appendChild(th);
        });
        table.appendChild(tr);

        // getting data from API
        // let url = 'https://swapi.co/api/planets/';
        $.getJSON(url, function (data) {
            // for debugging
            console.log(data);

            // func for toggling enable and disable on page nav buttons
            function ToggleAbility(direction) {
                let navButton = document.getElementById(direction);
                navButton.setAttribute('onclick', `dom.showTable('${data[direction.toLowerCase()]}')`);
                if (data[direction.toLowerCase()] === null) {
                    navButton.setAttribute('disabled', '');
                } else {
                    navButton.removeAttribute('disabled');
                }
            }
            // previous and next 10 planets button
            ToggleAbility('Previous');
            ToggleAbility('Next');

            // filling the table with data of planets
            let titles = ['name', 'diameter', 'climate', 'terrain', 'surface_water', 'population', 'residents'];
            data['results'].forEach(function (planet) {
                let tr = document.createElement('TR');
                titles.forEach(function (title) {
                    let td = document.createElement('TD');
                    td.setAttribute('scope', 'col');
                    let cell = planet[title];
                    if (cell !== 'unknown') {
                        switch(title) {
                            case 'diameter':
                                cell += ' km';
                                break;
                            case 'surface_water':
                                cell += '%';
                                break;
                            case 'population':
                                cell += ' people';
                                break;
                            case 'residents':
                                let residentsCount = planet[title].length;
                                if (residentsCount !== 0) {
                                    cell = '';
                                    let buttonText = residentsCount.toString() + ' resident(s)';
                                    let residentsButton = document.createElement('BUTTON');
                                    residentsButton.setAttribute('class', 'btn btn-primary residentsButton');
                                    residentsButton.setAttribute('type', 'button');
                                    residentsButton.setAttribute('data-toggle', 'modal');
                                    residentsButton.setAttribute('data-target', '#residentsModal');
                                    let argument = '';
                                    argument += `'` + [planet['name']] + `'`;
                                    let residentList = planet['residents'];
                                    residentList.forEach(function (residentUrl) {
                                        argument += `, '` + residentUrl + `'`;
                                    });
                                    residentsButton.setAttribute('onclick', `dom.showResidentsModal(${argument})`);

                                    residentsButton.innerText = buttonText;
                                    td.appendChild(residentsButton);
                                } else {
                                    cell = 'No known residents'
                                }
                                break;
                        }
                    }

                    // condition to avoid removing residents button
                    if (cell !== '') {
                        td.innerText = cell;
                    }
                    tr.appendChild(td);
                });

                // vote button
                let td = document.createElement('TD');
                td.setAttribute('scope', 'col');
                let voteButton = document.createElement('BUTTON');
                voteButton.setAttribute('class', 'voteButton');
                voteButton.setAttribute('hidden', '');
                voteButton.innerText = 'Vote';
                td.appendChild(voteButton);
                tr.appendChild(td);

                table.appendChild(tr);
            });
        });

        container.appendChild(table);
    },
    showResidentsModal: function () {
        console.log(arguments);
        let planetName = arguments[0];
        let residentsUrls = [];
        for (let i = 1; i < arguments.length; i++) {
            residentsUrls.push(arguments[i]);
        }
        console.log(residentsUrls);

        let modal = document.getElementById('residentsModal');
        let modalBody = modal.getElementsByClassName('modal-body')[0];
        modalBody.innerHTML = '';

        // modal title as planet name
        let modalTitle = document.getElementById('exampleModalLongTitle');
        modalTitle.innerText = `${planetName}`;

        // creating table with header
        let table = document.createElement('TABLE');
        table.setAttribute('class', 'table table-striped');
        let tableTitles = ['Name', 'Height', 'Mass', 'Hair color',
            'Skin color', 'Eye color', 'Birth year', 'Gender'];
        let tr = document.createElement('TR');
        tableTitles.forEach(function (title) {
            let th = document.createElement('TH');
            th.setAttribute('scope', 'col');
            th.innerText = title;
            tr.appendChild(th);
        });
        table.appendChild(tr);

        // getting residents data for table
        let titles = ['name', 'height', 'mass', 'hair_color',
            'skin_color', 'eye_color', 'birth_year', 'gender'];
        residentsUrls.forEach(function (residentUrl) {
            $.getJSON(residentUrl, function (resident) {
                let tr = document.createElement('TR');
                titles.forEach(function (title) {
                    let td = document.createElement('TD');
                    td.setAttribute('scope', 'col');
                    let cell = resident[title];
                    if (cell !== 'unknown') {
                        switch (title) {
                            case 'height':
                                cell += ' cm';
                                break;
                            case 'mass':
                                cell += ' kg';
                                break;
                        }
                    }
                    td.innerText = cell;
                    tr.appendChild(td);
                });
                table.appendChild(tr);
            })
        });
        modalBody.appendChild(table);
    }
};