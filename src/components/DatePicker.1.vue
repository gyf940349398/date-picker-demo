<template>
  <div
    class="date-picker"
    ref="datePicker"
  >
    <div
      class="current-year"
    >
      {{currentDate.year}}
    </div>
    <ul
      id="date-list"
      class="date-list"
      ref="dateList"
    >
      <li
        class="date-item"
        v-for="(date, index) in dateList"
        :key="index"
      >
        {{date.month}}月
      </li>
    </ul>
  </div>
</template>

<script>
import IScroll from 'iscroll';
// 每个月份块的宽度
const DATE_ITEM_WIDTH = 62;

export default {
  name: 'DatePicker',
  props: {
   startDate: {
     type: Date,
     default: () => new Date('1971-01-01 08:00:00')
   },
   endDate: {
     type: Date,
     default: () => new Date('2099-01-01 08:00:00')
   }
  },
  data () {
    return {
      scrolling: false,
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0,
      dateList: [],
      currentDate: {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1
      }
    };
  },
  computed: {
    // currentDateIndex () {
    //   return this.dateList.findIndex((item) => {
    //     return item.year === this.currentDate.year && item.month === this.currentDate.month;
    //   });
    // }
  },
  mounted () {
    const dateList = [];
    const startYear = this.startDate.getFullYear();
    const endYear = this.endDate.getFullYear();

    for (var i = startYear; i <= endYear; i++) {
      let startMonth = 0;
      let endMonth = 0;
      if (i === startYear) {
        startMonth = this.startDate.getMonth() + 1;
        endMonth = startYear === endYear ? this.endDate.getMonth() + 1 : 12;
      } else if (i === endYear) {
        startMonth = 1;
        endMonth = this.endDate.getMonth() + 1;
      } else {
        startMonth = 1;
        endMonth = 12
      }
      
      for (var j = startMonth; j <= endMonth; j++) {
        dateList.push({
          year: i,
          month: j
        });
      }
    }

    this.dateList = dateList;

    new IScroll('#date-list');
    // this.$nextTick(() => {
    //   this.dateListMove('left', this.currentDateIndex, true);
    // });
  },
  methods: {
    // // 获取滑动方向
    // getTouchMoveDirection () {
    //   //获取滑动距离
    //   const distanceX = this.endX - this.startX;
    //   const distanceY = this.endY - this.startY;

    //   //判断滑动方向
    //   if (Math.abs(distanceX) > Math.abs(distanceY) && distanceX > 0) {
    //       return 'right';
    //   } else if (Math.abs(distanceX) > Math.abs(distanceY) && distanceX < 0) {
    //       return 'left';
    //   } else if (Math.abs(distanceX) < Math.abs(distanceY) && distanceY < 0) {
    //       return 'up';
    //   } else if (Math.abs(distanceX) < Math.abs(distanceY) && distanceY > 0) {
    //       return 'down';
    //   } else {
    //       return '';
    //   }
    // },
    // // 根据距离计算出需要被移动的格数
    // getDateItemNeedMovedByDistance (distance) {
    //   return Math.floor(distance / DATE_ITEM_WIDTH);
    // },
    // touchStartCallback (e) {
    //   if ((this.direction === 'right' && this.currentDateIndex === 0)
    //     || (this.direction === 'left' && this.currentDateIndex === this.dateList.length - 1)) {
    //     return;
    //   }

    //   if (this.scrolling) {
    //     return;
    //   } else {
    //     this.startX = e.changedTouches[0].pageX;
    //     this.startY = e.changedTouches[0].pageY;
    //   }
    // },
    // touchEndCallback (e) {
    //   if ((this.direction === 'right' && this.currentDateIndex === 0)
    //     || (this.direction === 'left' && this.currentDateIndex === this.dateList.length - 1)) {
    //     return;
    //   }

    //   // 方向
    //   const direction = this.getTouchMoveDirection(e);

    //   // 判断有效方向，过滤掉上和下两个方向
    //   if (direction !== 'left' && direction !== 'right') {
    //     this.scrolling = false;
    //     return;
    //   }

    //   if (this.scrolling) {
    //     return;
    //   } else {
    //     this.scrolling = true;
    //     this.endX = e.changedTouches[0].pageX;
    //     this.endY = e.changedTouches[0].pageY;

    //     // 距离，单位：px
    //     const distance = Math.abs(this.endX - this.startX);
    //     // 如果滑动小于一格的宽度，则视为无滑动
    //     if (distance < DATE_ITEM_WIDTH) {
    //       return;
    //     }
    //     // 需要被移动的格数
    //     const dateItemNumNeedMoved = this.getDateItemNeedMovedByDistance(distance);

    //     // 先滚动，再更新当前月份
    //     this.dateListMove(direction, dateItemNumNeedMoved, false, () => {
    //       setTimeout(() => {
    //         this.updateCurrentMonthIndex(direction, dateItemNumNeedMoved, false);
    //       }, 1000);
    //     });
    //   }
    // },
    // dateListMove (direction, dateItemNumNeedMoved, isInit = false, callback) {
    //   const dateList = this.$refs.dateList;

    //   // 目前的left值
    //   const oldLeft = dateList.style.left === '' ? 0 : parseInt(dateList.style.left);

    //   if (!isInit) {
    //     // 处理边界情况，滚动个数大于其滚动方向的剩余个数
    //     if (direction === 'left') {
    //       dateItemNumNeedMoved = dateItemNumNeedMoved >= (this.dateList.length - 1 - this.currentDateIndex) ? (this.dateList.length - 1 - this.currentDateIndex) : dateItemNumNeedMoved;
    //     } else {
    //       dateItemNumNeedMoved = dateItemNumNeedMoved >= this.currentDateIndex ? this.currentDateIndex : dateItemNumNeedMoved;
    //     }
    //   }
    //   console.log('dateItemNumNeedMoved: ', dateItemNumNeedMoved);

    //   // 需要移动的距离
    //   const newLeft = oldLeft + (direction === 'left' ? -(dateItemNumNeedMoved * DATE_ITEM_WIDTH) : (dateItemNumNeedMoved * DATE_ITEM_WIDTH)) + 'px';
    //   dateList.style.left = newLeft;
      
    //   callback && callback();
    // },
    // updateCurrentMonthIndex (direction, dateItemNumNeedMoved, isInit = false) {
    //   if (!isInit) {
    //     // 处理边界情况，滚动个数大于其滚动方向的剩余个数
    //     dateItemNumNeedMoved = direction === 'right' && dateItemNumNeedMoved >= this.currentDateIndex ? this.currentDateIndex : dateItemNumNeedMoved;
    //     dateItemNumNeedMoved = direction === 'left' && dateItemNumNeedMoved >= (this.dateList.length - 1 - this.currentDateIndex) ? (this.dateList.length - 1 - this.currentDateIndex) : dateItemNumNeedMoved;
    //   }

    //   let newCurrentDateIndex = this.currentDateIndex + (direction === 'left' ? dateItemNumNeedMoved : -(dateItemNumNeedMoved));

    //   // 处理边界情况，最多滚动到第一个和最后一个
    //   newCurrentDateIndex = newCurrentDateIndex < 0 ? 0 : newCurrentDateIndex;
    //   newCurrentDateIndex = newCurrentDateIndex > this.dateList.length - 1 ? this.dateList.length - 1 : newCurrentDateIndex;

    //   this.currentDate = this.dateList[newCurrentDateIndex];
    //   this.scrolling = false;
    // },
    // dateItemClick (index) {
    //   this.currentDate = this.dateList[index];
    // }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.date-picker {
  width: 100%;
  height: 60px;
  overflow: hidden;
}
.current-year {
  display: flex;
  align-items: center;
  height: 20px;
}
.date-list {
  position: relative;
  left: 0;
  list-style: none;
  display: flex;
  transition: left 1s ease;
}
.date-item {
  flex: none;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 40px;
  background: #f9f9f9;
  border-left: 1px solid #333;
  border-right: 1px solid #333;
}
.date-item.current {
  color: #fff;
  background: #abcdef;
}
</style>
