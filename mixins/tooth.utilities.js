import { teeth as staticTeeth } from '@/teeth.cfg'

export default {
  methods:{
    getSortedBridgeTeeth(bridge){
      const teeth = this.$fraestechnik.tooth.findItems().filter(x => x.bridge === bridge._id);
      let sortedTeeth = []
      staticTeeth.forEach(x => {
        const foundDbTooth = teeth.find(y => y.toothNumber === x.number)
        if(foundDbTooth) sortedTeeth = [...sortedTeeth, foundDbTooth]
      })
      return sortedTeeth
    },
    getFirstBridgeTooth(bridge) {
      const sortedTeeth = this.getSortedBridgeTeeth(bridge)
      return sortedTeeth[0]
    },
    getLastBridgeTooth(bridge) {
      const sortedTeeth = this.getSortedBridgeTeeth(bridge)
      return sortedTeeth[sortedTeeth.length - 1]
    },
    isMarginalTooth(tooth){
      if(!tooth.bridge) return
      const bridge = this.$fraestechnik.bridge.findItem(tooth.bridge)
      const firstBridgeTooth = this.getFirstBridgeTooth(bridge)
      const lastBridgeTooth = this.getLastBridgeTooth(bridge)
      return tooth._id === firstBridgeTooth._id || tooth._id === lastBridgeTooth._id
    }            
  }
}