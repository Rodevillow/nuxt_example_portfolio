export function registerStore({store, state, mutations, namespace, modules}:any){
  store.registerModule(namespace, {
      namespaced: true,
      modules,
      state,
      mutations
  }, { preserveState: !!store.state[namespace] })
}