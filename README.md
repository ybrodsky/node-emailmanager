# Node EmailManager
Wrapper to use EmailManager API with NodeJs


## Example usage
```javascript
var EmailManager = require('./index.js');

var emailmanager = new EmailManager('domain', 'your@email.com', 'password');

emailmanager.action('contacts', {
  limit: 1
}, function(err, results) {
  console.log(results);
});
```

Available actions can be found in [EmailManager's API](http://api.emailmanager.com/1.0.html)
