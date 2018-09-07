let loadedProviders = {};
let initializedProviders = {};
let loadedInstances = {};

const initializeProviders = (providers) => {
  if (providers) {
    providers.forEach((provider) => {
      initEntity(provider, loadedProviders);
    })
  }
}

const initializeInstances = (instances) => {
  if (instances) {
    instances.forEach((instance) => {
      initEntity(instance, loadedInstances)
    })
  }
}

const getService = (name) => {
  if (initializedProviders.hasOwnProperty(name)) {
    return initializedProviders[name];
  } else if (loadedProviders.hasOwnProperty(name)) {
    return initializedProviders[name] = new loadedProviders[name]();
  } else if (loadedInstances.hasOwnProperty(name)) {
    return new loadedInstances[name];
  } else {
    throw 'Unknown provider: ' + name ;
  }
}

const initialize = ({providers, instances}) => {
  initializeProviders(providers);
  initializeInstances(instances);
}
const get = (name) => {
  return getService(name);
}

const has = (name) => {
  return loadedProviders.hasOwnProperty(name);
}

const cleanUp = () => {
  loadedProviders = {};
  initializedProviders = {};
  loadedInstances = {};
}

function initEntity(entity, cache) {
  if (entity.name === 'hasOwnProperty') {
    throw 'Provider can\'t have hasOwnProperty name';
  }

  if (cache.hasOwnProperty(entity.name)) {
    throw 'Provider ' + entity.name + ' already registered';
  }

  cache[entity.name] = entity;
}

module.exports = {
  initialize,
  get,
  has,
  cleanUp
}
