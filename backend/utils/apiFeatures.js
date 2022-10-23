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

    pagination(resultPerPage){
        const currPage = Number(this.queryStr.page) || 1;

        // If we have 50 products and we want to disply 10 products per page.. skip = 50-10
        const skip = resultPerPage * (currPage - 1);

        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
    }
}

module.exports = ApiFeatures;