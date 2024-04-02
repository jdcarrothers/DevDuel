<template> 
   <div class="inner-container"> 
      <div class="code-rating">
        <svg viewBox="0 0 36 36" class="circular-chart">
          <path class="circle-bg"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#eee"
            stroke-width="2.8" />

          <path class="circle"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            :stroke="ratingColor"
            stroke-width="2.8"
            :stroke-dasharray="circumference + ' ' + circumference"
            stroke-dashoffset="circumference"
            ref="circle" />
          <text x="18" y="20.35" class="percentage" dominant-baseline="middle" text-anchor="middle">{{ codeRating }}%</text>
        </svg>
      </div>
      <div class="code-rating-explanation">
        <h1>Your Code Rating</h1>
        <p>Strive for improvement, one line at a time!</p>
      </div>
    </div>
</template>

<script>

export default {
  name: 'CodeRatingPanel',
  props: {
    codeRating: {
      type: Number,
      required: true,
    },
  },
  data() {
  },
  mounted() {
    this.animateCircle();
    },
  computed: {
    circumference() {
      return 2 * Math.PI * 15.9155;
    },
    strokeDashoffset() {
      return this.circumference - (this.codeRating / 100) * this.circumference;
    },
    ratingColor() {
      if (this.codeRating < 20) {
        return '#ff0000'; 
      } else if (this.codeRating < 40) {
        return '#ff4500'; 
      } else if (this.codeRating < 60) {
        return '#ffd700'; 
      } else if (this.codeRating < 80) {
        return '#9acd32';
      } else {
        return '#008000'; 
      }
    },
  },
  methods: {
      animateCircle() {
        requestAnimationFrame(() => {
          this.$refs.circle.style['stroke-dashoffset'] = this.strokeDashoffset;
        });
      },
    },
};
</script>

<style scoped>
.inner-container {
  display: flex;
  flex-direction: row;
  background-color: #d8d8d8;
  border: 1px solid #DDE0E4;
  border-radius: 8px;
  color: #333;
  font-size: 1vw; /* Responsive font size */
  width: 80vw; /* Adjust based on your preference */
  max-width: 800px; /* Ensures it doesn't get too large on wider screens */
  height: auto; /* Adjusts automatically based on content, you can also set a min-height if necessary */
  box-sizing: border-box; /* Ensures padding is included in the width and height calculations */
}
.circular-chart {
    display: block;
    margin: 10px auto;
    max-width: 80%;
    max-height: 250px;
}
  
.circle-bg {
    fill: none;
    stroke: #eee;
}
  
.circle {
    fill: none;
    stroke-linecap: round;
    transition: stroke-dashoffset 0.35s;
    transform: rotate(-90deg);
    transform-origin: 50% 50%;
    transition: stroke-dashoffset 1.32s ease;
}

.percentage {
    fill: #333;
    font-family: sans-serif;
    font-size: 0.5em;
    text-anchor: middle;
}

.code-rating {
    display: flex;
    align-items: center;
    justify-content: center; 
}
/* percentage text below */
.code-rating text {
    font-weight: bold;
}
/*  */
.code-rating svg {
    height: 400px;
}
.code-rating-explanation {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-left: 70px;
}
.codeRating {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px;
    background-color: #FAFBFC;
    border: 1px solid #DDE0E4;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    color: #333;
    font-size: 18px;
}
</style>