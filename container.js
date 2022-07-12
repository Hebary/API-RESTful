 class Container {

    constructor(name) {
        this.name = name;
        this.items = [];
    }

    save(item) {
        if(!item.id){
            item.id = idGenerator();
        }
        this.items = [...this.items, item];
        return this.items;
    }

    getById(id) {
        return this.items.find(item => item.id === id );
    }
    
    getAll() {
        return this.items;
    }

    deleteById(id) {
        this.items = this.items.filter(item => item.id !== id)
        return this.items;
    }

    deleteAll() {
        this.items = [];
    }
    
    updateOne(id, item) {
        const index = this.items.findIndex(item => item.id === id);
        this.items[index] = item;
        return this.items[index];
    }

    deleteOne(id) {
        this.items = this.items.filter(item => item.id !== id)
        return this.items;
    }


}

//Helper function
function idGenerator(){
    return Date.now().toString(32) + Math.random().toString(32).substring(2);
}

module.exports = Container;