<script type="text/jsx">
import { filter } from 'rxjs/operators'
import { VIcon, VBtn } from 'vuetify/lib'

import simplebar from 'simplebar-vue'
import 'simplebar/dist/simplebar.min.css'

export default {
  name: 'NodeTree',
  components: {
    'v-icon': VIcon,
    'v-btn': VBtn,
    simplebar
  },
  data () {
    return {
      myNode: null,
      selectedNodeId: null
    }
  },
  methods: {
    onClick (item) {
      this.node$.next({
        type: 'action/edit_node/request',
        payload: item
      })
    },
    handleDelete (item) {
      this.node$.next({
        type: 'action/delete_node/request',
        payload: item.objectId
      })
    },
    createItem (item, indent) {
      if (!item) {
        return null
      }

      let delBtn

      if (item.parent !== null) {
        delBtn = (
          <v-btn icon small class="del-btn"
            vOn:click_stop_prevent={this.handleDelete.bind(this, item)}>
            <v-icon medium>delete</v-icon>
          </v-btn>
        )
      }

      return (
        <div class={{ item: true }} key={item.objectId} style={{ 'padding-left': `${8 * indent}px` }}>
          <div class={{ content: true, 'is-selected': item.objectId === this.selectedNodeId }}
            onClick={this.onClick.bind(this, item)}>
            {
              item.children ? (<v-icon medium>folder</v-icon>) : (<v-icon medium>crop_square</v-icon>)
            }
            <div class="action-content">
              {item.name}
            </div>
            {delBtn}
          </div>
          {
            item.children && item.children.map((subItem) => {
              return this.createItem(subItem, indent + 1)
            })
          }
        </div>
      )
    }
  },
  created () {
    this.subscriptions = []

    this.subscriptions.push(
      this.node$.pipe(
        filter(action => action.type === 'action/set_root_node/broadcast')
      ).subscribe((action) => {
        this.myNode = action.payload
      })
    )

    this.subscriptions.push(
      this.node$.pipe(
        filter(action => action.type === 'action/edit_node/broadcast')
      ).subscribe((action) => {
        this.selectedNodeId = action.payload.objectId
      })
    )
  },
  mounted () {
    const { width, height } = window.getComputedStyle(this.$refs.nodeTree.$el, null)
    this.$refs.nodeTree.$el.style.width = width
    this.$refs.nodeTree.$el.style.height = height
  },
  beforeDestroy () {
    this.subscriptions.forEach((item) => {
      item.unsubscribe()
    })
  },
  render: function (h) {
    return (
      <simplebar data-simplebar-auto-hide="false" class="wrap" ref="nodeTree">
        <div className="node-tree p-1">
          {
            this.createItem(this.myNode, 0)
          }
        </div>
      </simplebar>
    )
  }
}
</script>

<style scoped lang="scss">
  .wrap {
    overflow-x: hidden;
    flex-grow: 1;
  }
  .node-tree {
  }
  .item {
    min-height: 28px;
    border-radius: 4px;
    color: #e9ecf1;
  }

  .content {
    display: flex;
    margin-bottom: 4px;

    &.is-selected {
      background-color: rgb(33, 150, 243, 0.08);
      color: rgb(33, 150, 243);
    }
  }

  .action-btn {
    width: 28px;
    height: 28px;
    flex-shrink: 0;
    background-color: #323944;
  }

  .action-content {
    flex-grow: 1;
    display: flex;
    align-items: center;
    padding-left: 8px;
  }

  .del-btn {
    &:hover {
      color: #E91E63;
    }
  }
</style>
