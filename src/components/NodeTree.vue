<script type="text/jsx">
import { filter } from 'rxjs/operators'
import { Icon } from 'view-design'

export default {
  name: 'NodeTree',
  components: {
    Icon,
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
          <div class="del-btn"
            vOn:click_stop_prevent={this.handleDelete.bind(this, item)}>
            <Icon type="md-trash" />
          </div>
        )
      }

      return (
        <div class={{ item: true }} key={item.objectId} style={{ 'padding-left': `${8 * indent}px` }}>
          <div class={{ content: true, 'is-selected': item.objectId === this.selectedNodeId }}
            onClick={this.onClick.bind(this, item)}>
            {
              item.children ? (<Icon type="ios-folder" />) : (<Icon type="ios-egg" />)
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
  beforeDestroy () {
    this.subscriptions.forEach((item) => {
      item.unsubscribe()
    })
  },
  render: function (h) {
    return (
      <div className="node-tree p-1">
        {
          this.createItem(this.myNode, 0)
        }
      </div>
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
    width: 24px;
    height: 24px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      color: #ed4014;
    }
  }
</style>
