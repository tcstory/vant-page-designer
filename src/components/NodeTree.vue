<script type="text/jsx">
import { filter } from 'rxjs/operators'

export default {
  name: 'NodeTree',
  data () {
    return {
      myNode: null
    }
  },
  methods: {
    createItem (item, indent) {
      if (!item) {
        return null
      }

      return (
        <div class="item" key={item.objectId} style={{ 'margin-left': `${8 * indent}px` }}>
          <div class="content">
            <div class="action-btn"/>
            <div class="action-content">{item.name}</div>
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
    this.node$.pipe(
      filter(action => action.type === 'SET_ROOT')
    ).subscribe((action) => {
      this.myNode = action.payload
    })
  },
  render: function (h) {
    return (
      <div class="node-tree p-2">
        {
          this.createItem(this.myNode, 0)
        }
      </div>
    )
  }
}
</script>

<style scoped lang="scss">
  .item {
    background-color: #202128;
    min-height: 28px;
    /*width: 280px;*/
    border-radius: 4px;
    color: #e9ecf1;
    /*padding-left: 14px;*/

    &.is-selected {
      background-color: #3e4149;
    }
  }

  .content {
    display: flex;
    margin-bottom: 4px;
  }

  .action-btn {
    width: 28px;
    height: 28px;
    flex-shrink: 0;
    background-color: #323944;
  }

  .action-content {
    flex-grow: 1;
    line-height: 28px;
    padding-left: 8px;
  }
</style>
