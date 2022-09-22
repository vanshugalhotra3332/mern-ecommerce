class ApiFeatures {
  constructor(urlQueryObj) {
    this.urlQueryObj = urlQueryObj; // url query object which we will get from the url,
    // http://localhost:4000/api/v1/products?name=steady
    // {name: 'steady'}
    this.queryObject = {}; // used for searching
  }

  search() {
    const name = this.urlQueryObj.name;
    // console.log(this.urlQueryObj);

    if (name) {
      // if name is passed as a query
      this.queryObject.name = {
        // then we will append the name in query object
        $regex: name, // using regex cuz we wanna search anywhere in the string
        $options: "i", // searching for case insensitive
      };
    }
    return this;
  }

  filter() {
    // for categories we will pass categories like "," comma seperated
    // http://localhost:4000/api/v1/products?categories=music,laptop

    const categories = this.urlQueryObj.categories;
    const numericFilters = this.urlQueryObj.numericFilters;

    if (categories) {
      this.queryObject.$or = [];
      categories.split(",").forEach((cat) => {
        cat = cat.toLowerCase();
        let obj = { category: cat };
        this.queryObject.$or.push(obj);
      });
    }

    if (numericFilters) {
      // numericFilters are like price>50,rating>=3
      const operatorMap = {
        ">": "$gt",
        ">=": "$gte",
        "=": "$eq",
        "<": "$lt",
        "<=": "$lte",
        "!=": "$ne",
      }; // will use this to map > and other operators as mongodb understandable form like $gt etc
      const regEx = /\b(<|>|>=|=|<|<=|!=)\b/g;
      let filters = numericFilters.replace(
        regEx,
        (match) => `-${operatorMap[match]}-`
      );
      const options = ["price", "rating"];

      // filters are something like price-$gt-50,rating-$gt-3

      this.queryObject.$and = []; // using and operator in mongodb

      filters = filters.split(",").forEach((item) => {
        const [field, operator, value] = item.split("-");
        // field consists: price or rating or any other
        // operator consists: $gt, $lt or any other
        // value consists: 50, 3 ...
        if (options.includes(field)) {
          let obj = {};
          obj[field] = { [operator]: Number(value) }; 
          this.queryObject.$and.push(obj); // appending the filter to the query object
        }
      });
    }

    return this;
  }
}

module.exports = ApiFeatures;
