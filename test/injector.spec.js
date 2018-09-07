var initialize = require('../src/injector').initialize;
var get = require('../src/injector').get;
var has = require('../src/injector').has;
var cleanUp = require('../src/injector').cleanUp;

class MySingleton {}

describe('Injector', () => {

  beforeEach(() => {
    cleanUp();
  })

  it('initialize should be defined', () => {
    expect(initialize).toBeDefined();
  });

  it('initialize should be single', () => {
    expect(require('../src/injector').initialize).toBe(require('../src/injector').initialize);
  });

  it('get should be defined', () => {
    expect(get).toBeDefined();
  });

  it('has should be defined', () => {
    expect(has).toBeDefined();
  });

  it('should initiliaze modules with providers', () => {
    initialize({
      providers: [MySingleton]
    });

    expect(has('MySingleton')).toBe(true);
  });

  it('should not allow provider with hasOwnProperty name', () => {
    class hasOwnProperty{}
    expect(() => {
      initialize({
        providers: [hasOwnProperty]
      });
    }).toThrow();
  });

  it('should return provider via get method', () => {
    initialize({
      providers: [MySingleton]
    });

    expect(get('MySingleton')).toBeDefined();
    expect(get('MySingleton')).toEqual(new MySingleton);
  });

  it('should return provider as singleton', () => {
    initialize({
      providers: [MySingleton]
    });

    expect(get('MySingleton')).toBe(get('MySingleton'))
  });

  it('should throw if unknown provider required', () => {
    initialize({
      providers: [MySingleton]
    })

    expect(() => {
      get('OtherSingleton')
    }).toThrow();
  });

  it('should not initialize singleton when wasnt called', () => {
    const myFn = jest.fn();
    class MySingleton{
      constructor(){
        myFn();
      }
    }

    initialize({
      providers: [MySingleton]
    });

    expect(myFn.mock.calls.length).toBe(0);
  });

  it('should initialize singleton when called only once', () => {
    const myFn = jest.fn();
    class MySingleton{
      constructor(){
        myFn();
      }
    }

    initialize({
      providers: [MySingleton]
    });

    get('MySingleton');
    get('MySingleton');

    expect(myFn.mock.calls.length).toBe(1);
  });

  it('should add instances', () => {
    class MyInstance {}
    initialize({
      instances: [MyInstance]
    });

    expect(get('MyInstance')).toEqual(new MyInstance);
  });

  it('should call func for every instance', () => {
    const myFn = jest.fn();
    class MyInstance {
      constructor() {
        myFn();
      }
    }

    initialize({
      instances: [MyInstance]
    });

    get('MyInstance');
    get('MyInstance');
    get('MyInstance');

    expect(myFn.mock.calls.length).toBe(3);
  });

  it('should add ability to inject other providers into provider', () => {
    class MyInstance { }

    class MyOtherInstance {
      constructor() {
        this.myInstance = get('MyInstance');
      }
    }

    initialize({
      providers: [
        MyInstance,
        MyOtherInstance
      ]
    });
    const myOtherInstance = get('MyOtherInstance');

    expect(get('MyInstance')).toBe(myOtherInstance.myInstance);
  });

  it('should add ability to inject other providers into provider randomly', () => {
    class MyInstance {
      constructor() {
        this.myOtherInstance = get('MyOtherInstance');
      }
    }

    class MyOtherInstance {

    }

    initialize({
      providers: [
        MyInstance,
        MyOtherInstance
      ]
    });

    const myInstance = get('MyInstance');

    expect(get('MyOtherInstance')).toBe(get('MyOtherInstance'))
  });

  it('should initialize func of inner instance', () => {
    const myFn = jest.fn();
    class MyInstance {
      constructor() {
        this.myOtherInstance = get('MyOtherInstance');
      }
    }

    class MyOtherInstance {
      constructor() {
        myFn();
      }
    }

    initialize({
      providers: [
        MyInstance,
        MyOtherInstance
      ]
    });

    const myInstance = get('MyInstance');

    expect(myFn.mock.calls.length).toBe(1);
  });

  it('should be able to register from multiple init functions', () => {
    class MySingleton {}

    initialize({
      providers: [MySingleton]
    })

    class MyOtherSingleton {}

    initialize({
      providers: [MyOtherSingleton]
    });

    expect(has('MySingleton')).toBe(true);
    expect(has('MyOtherSingleton')).toBe(true);
  });

  it('should throw if already existing provider injectring from other init', () => {
    class MySingleton {}

    initialize({
      providers: [MySingleton]
    })

    expect(() => {
      initialize({
        providers: [MySingleton]
      });
    }).toThrow();
  });
});
