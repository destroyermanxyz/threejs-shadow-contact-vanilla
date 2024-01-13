# Simple way to use shadow contact with threejs.

https://github.com/destroyermanxyz/threejs-shadow-contact-vanilla/assets/114258377/f690b754-2d32-4db0-849c-693f0cfe0c88

I just copied the threejs example and make it working when i instanciate it.\

You can tweak values from the gui and after modify it at the top of the ShadowContact.js\
To make the plane transparent set the plane opacity to 0.\

```js
import ShadowContact from "./ShadowContact";

this.shadowContact = new ShadowContact(this.renderer, this.scene, this.gui); // gui is optional

// in your update/tick function
if (this.shadowContact) this.shadowContact.update();
```

You can also look at the implementation of it in the main.js file.
