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
});
