class View {
    constructor(){
        this.app = document.getElementById('app');
        this.searchLine = this.createElement("div", "search-line");
        this.searchInput = this.createElement("input", "search-line__input");
        this.searchLine.append(this.searchInput);
        this.searhResults = this.createElement("div", "search-results");
        this.searchLine.append(this.searhResults);
        this.app.append(this.searchLine);
        this.searchLine.append(this.searhResults);
    }

    createElement(elementTag, elementClass){
        const element = document.createElement(elementTag);

        if(elementClass){
            element.classList.add(elementClass);
        }

        return element;
    }
    createRep(repsData){
        const repElem = this.createElement('li', 'search-results__item');
        repElem.innerHTML = `<div class = 'item-title'>${repsData.name}</div>`;
        repElem.addEventListener('click', () => this.showRepsData(repsData));
        this.searhResults.append(repElem);
    }

    clearReps() {
        this.searhResults.innerHTML = '';
    }

    showRepsData(repsData){
        this.repInfo = this.createElement('li', 'rep-info');
        this.repInfo.innerHTML = `Name: ${repsData.name}<br> Owner: ${repsData.owner.login}<br> Stars: ${repsData.stargazers_count}`;
        this.app.append(this.repInfo);
        this.deleteButton = this.createElement('div', 'remove-button');
        this.repInfo.append(this.deleteButton);
        this.searchInput.value = '';
        this.clearReps();
    }

    saveRepsData(){
        a = document.querySelectorAll('.rep-info');
        return a
    }
}

class Search {
    constructor(view){
        this.view = view;
        this.view.searchInput.addEventListener('keyup', this.debounce(this.searchReps.bind(this), 500));
    }

    async searchReps(){
        if(this.view.searchInput.value){
            return await fetch(`https://api.github.com/search/repositories?q=${this.view.searchInput.value}&per_page=5`).then((res) => {
                if (res.ok){
                    this.view.clearReps();
                    res.json().then(res => {
                        res.items.forEach((rep) => {
                            this.view.createRep(rep);
                        })
                    })
                } else {
                    this.view.clearReps();
                }
            })
        } else{
            this.view.clearReps();
        }
    }

    debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }
}
document.addEventListener('click', function(e){
    if(e.target.className == 'remove-button'){
        e.target.closest('.rep-info').remove();
    }
 });
new Search(new View());