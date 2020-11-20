// export some basic functions and collections used by the API
import xml from 'xml2js';
const User = require("../schemas/User");

const builder = new xml.Builder({
  renderOpts: { 'pretty': false }
});

module.exports = {
    xmlOptions: {
        charkey: 'value',
        trim: false,
        explicitRoot: false,
        explicitArray: false,
        normalizeTags: false,
        mergeAttrs: true,
    },
      
    bustHeaders: function(request, response, next) {
        request.app.isXml = false;
        if (request.headers['content-type'] === 'text/xml' || request.headers['accept'] === 'text/xml') {
          request.app.isXml = true;
        }
        next();
    },

    compare: function(a, b) {
      // Use toUpperCase() to ignore character casing
      const bandA = a.dist;
      const bandB = b.dist;
    
      let comparison = 0;
      if (bandA > bandB) {
        comparison = 1;
      } else if (bandA < bandB) {
        comparison = -1;
      }
      return comparison;
    },

     distance: function(lat1, lon1, lat2, lon2) {
      lat1 = lat1 * Math.PI / 180;
      lat2 = lat2 * Math.PI / 180;
      lon1 = lon1 * Math.PI / 180;
      lon2 = lon2 * Math.PI / 180;
      var R = 6371; // km
      var x = (lon2 - lon1) * Math.cos((lat1 + lat2) / 2);
      var y = (lat2 - lat1);
      var d = Math.sqrt(x * x + y * y) * R;
      return d;
    },

    buildResponse: function(response, statusCode, data, preTag,xml) {
        if(xml){
            if(preTag === 'status'){
              response.status(statusCode).send(builder.buildObject(data));
            }
            else if(preTag === 'Users' || preTag === 'Incidents' || preTag === 'Reports'){
                response.status(statusCode).send(builder.buildObject({ [preTag] : { [preTag.substring(0,preTag.length -1)]: data }}));
            }
            else{
              if(typeof data.users != null &&  data.users.isArray){
                console.log("haha")
              }
              response.status(statusCode).send(builder.buildObject({ [preTag]: data }));
            }
          }
          else{
            response.status(statusCode).json(data);
          }
    },

    isAdmin: function(username) {
      // handle admin check
      return username === "admin";
    },

    isCoordinator: function(role) {
      return role === "coordinator" || role === "Coordinator";
    },

    titleGenerator: function(authorId, incidentTitle){
      let part = JSON.stringify(authorId).slice(1,-1);
      return part.slice(-5) + "-" + incidentTitle;
    }
};