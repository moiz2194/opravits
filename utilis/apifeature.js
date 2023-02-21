class Apifeature{
    constructor(search,searchkey){
      this.search=search;
      this.searchkey=searchkey;
    };
    Search=()=> {
      const keyword=this.searchkey.keyword ?{
        College:{
            $regex:this.searchkey.keyword,
            $options:'i'
        }
      }:{};
      this.search = this.search.find({...keyword});
       
      return this;
    };
    filter= ()=>{      
      let querycopy={...this.searchkey};
      const removeitems=["keyword","page","limit"];
      removeitems.forEach((key)=>{
        delete querycopy[key]
      });
      let querystr=JSON.stringify(querycopy);
      querycopy=JSON.parse(querystr);
      console.log(querycopy)
      this.search= this.search.find(querycopy);
      return this;
    };
    limit= (number)=>{      
     
      this.search= this.search.find().limit(number);
      return this;
    };
    bussiness=()=>{
      this.search=this.search.find({role:"business"})
      return this;
    }
}
module.exports=Apifeature
