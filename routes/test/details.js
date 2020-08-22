module.exports = (req,res)=>{
    let response = {}
    if(req.user) response.user = req.user;
    if(req.cookies) response.cookies = req.cookies;
    res.json(response)
  }