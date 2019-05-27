<template>
  <div class="date-picker">
    <div class="current-year">{{currentDate.year}}</div>
    <div
      class="date-list-wrapper"
      ref="dateListWrapper"
      @touchstart.stop="touchstartCallback"
      @touchend.stop="touchendCallback"
      @scroll.stop="scrollendCallback"
    >
      <ul id="date-list" class="date-list">
        <li
          class="date-item"
          v-for="(date, index) in dateList"
          @click.stop="selectDate(date, index)"
          :key="index"
        >
          {{date.month}}月
        </li>
      </ul>
    </div>
    <span class="date-pointer"></span>
  </div>
</template>

<script>
// 每个日期块的宽度，单位：px，默认：62
const DATE_ITEM_WIDTH = 62;

export default {
  name: 'DatePicker',
  props: {
   // 开始日期
   startDate: {
     type: Date,
     default: () => new Date('1970/01/01 08:00:00')
   },
   // 结束日期
   endDate: {
     type: Date,
     default: () => new Date('2099/01/01 23:59:59')
   },
   // 日期块宽度
   dateItemWidth: {
     type: Number,
     default: DATE_ITEM_WIDTH
   },
   // 是否递减显示日期，默认:false
   isDecrease: {
     type: Boolean,
     default: false
   }
  },
  data () {
    return {
      // 日期列表
      dateList: [],
      // 当前日期
      currentDate: {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1
      },
      // 是否正在滚动
      isScrolling: false,
      // 是否正在滑屏
      isTouching: false,
      scrollTimeout: false,
      // 是否点击切换的日期
      isClickEvent: false,
    };
  },
  watch: {
    currentDate (newVal) {
      this.$emit('dateChange', newVal);
      this.isClickEvent = false;
    }
  },
  methods: {
    generateDateList () {
      const dateList = [];
      const startYear = this.startDate.getFullYear();
      const endYear = this.endDate.getFullYear();

      for (var i = startYear; i <= endYear; i++) {
        let startMonth = 0;
        let endMonth = 0;
        if (i === startYear) {
          startMonth = this.startDate.getMonth() + 1;
          endMonth = 12;
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

      this.dateList = this.isDecrease ? dateList.reverse() : dateList;
    },
    updateDateListWrapperScrollLeft () {
      // 如果需要与游标对齐，scrollLeft应该为多少
      const correctScrollLeft = Math.ceil(Math.abs(this.$refs.dateListWrapper.scrollLeft / this.dateItemWidth)) * this.dateItemWidth;

      // 更新日期
      const dateIndex = correctScrollLeft / this.dateItemWidth;
      const newDate = this.dateList.find((item, index) => index === dateIndex);
      this.dateListWrapperScroll(newDate, dateIndex, () => {
        this.currentDateChange(newDate);
      });
    },
    touchstartCallback () {
      this.isTouching = true;
      this.isScrolling = true;
    },
    touchendCallback () {
      this.isTouching = false;
      // 如果是点击切换日期，则什么也不做
      if (this.isClickEvent) {
        return;
      }

      // 如果与滚动冲突，则什么也不做
      if (this.isScrolling) {
        return;
      }

      // 滑动结束后更新日期
      this.updateDateListWrapperScrollLeft();
    },
    scrollendCallback () {
      this.isScrolling = true;

      // 如果是点击切换日期，则下面的逻辑不执行
      if (this.isClickEvent) {
        return;
      }

      if (!this.isScrolling) {
        return;
      }

      // 以下逻辑模拟scrollend
      if (this.scrollTimeout) {
        clearTimeout(this.scrollTimeout);
      }
      this.scrollTimeout = setTimeout(() => {
        // 滚动结束后，更新日期
        this.isScrolling = false;
        if (this.isTouching) {
          return;
        }
        this.updateDateListWrapperScrollLeft();
      }, 100);
    },
    selectDate (date, dateIndex) {
      this.isClickEvent = true;
      this.dateListWrapperScroll(date, dateIndex, () => {
        this.currentDateChange(date);
      });
    },
    dateListWrapperScroll (date, dateIndex, callback) {
      const distance = dateIndex * this.dateItemWidth;
      this.$refs.dateListWrapper.scrollTo({
        top: 0,
        left: distance,
        behavior: 'smooth'
      });

      // 如果目标日期块不能滚动到游标位置，即滚动容器右边已到头，则只滚动但不上报新的日期
      if (this.dateList.length * this.dateItemWidth - (dateIndex + 1) * this.dateItemWidth >= this.$refs.dateListWrapper.offsetWidth) {
        callback && callback();
      }
    },
    currentDateChange (date) {
      this.currentDate = date;
    }
  },
  mounted () {
    // 生成日期列表
    this.generateDateList();
    // 根据当前日期选中日期块
    this.$nextTick(() => {
      const dateIndex = this.dateList.findIndex(item => item.year === this.currentDate.year && item.month === this.currentDate.month);
      this.dateListWrapperScroll(this.currentDate, dateIndex, () => {
        this.currentDateChange(this.currentDate);
      });
    });
  }
}
</script>

<style scoped>
.date-picker {
  position: relative;
  width: 100%;
  height: 60px;
}
.current-year {
  display: flex;
  align-items: center;
  height: 20px;
}
.date-list-wrapper {
  width: 100%;
  height: 40px;
  overflow-x: scroll;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}
.date-list {
  position: relative;
  left: 0;
  list-style: none;
  display: flex;
}
.date-pointer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 62px;
  height: 40px;
  background: #000;
  opacity: 0.2;
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
</style>
