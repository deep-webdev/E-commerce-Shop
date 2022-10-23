class ApiFeatures{
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    search(){
        const name = this.queryStr.name ? {
            name:{
                $regex: this.queryStr.name,
                $options: "i"
            }
        } : { };
        this.query = this.query.find({ ...name });
        return this; 
    }
    filter(){
        const queryCopy = { ...this.queryStr };

        // Remove fields for category
        const removeFields = ["name", "page", "limit"];
        removeFields.forEach(key=> delete queryCopy[key]);
        // console.log(queryCopy);

        // Filter for Price and Rating

        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, key=> `$${key}`);

        this.query = this.query.find(JSON.parse(queryStr));

        return this;
    }
}

module.exports = ApiFeatures;