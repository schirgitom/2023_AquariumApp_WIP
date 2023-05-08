import {Database, Storage} from "@ionic/storage";

export class Appstorage
{
    store = new Storage();

    private db: Database = undefined;

    constructor() {
            this.init();
    }

    private init()
    {
        if(!this.db) {
            console.log("DB created");
            this.db = this.store.create();
        }
    }

    public get(key: string)
    {
        this.init();
        return Promise.resolve(this.store?.get(key));
    }

    public set(key: string, data: any)
    {
        this.init();
        return this.store?.set(key, data);
    }

    public remove(key: string)
    {
        this.init();
        return this.store?.remove(key);
    }
}