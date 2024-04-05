<template> 
   <div class="inner-container"> 
    <h1>Your Code Rating</h1>
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
  flex-direction: column;
  background: linear-gradient(145deg, #e6e6e6, #ffffff); 
  border: none; 
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25); 
  border-radius: 16px; 
  color: #333;
  max-width: 300px;
  text-align: center;
  padding: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease; 
}

.inner-container:hover {
  transform: translateY(-10px); 
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4); 
}

.circular-chart {
    display: block;
    margin: 10px auto;
    max-width: 100%;
    max-height: 250px;
    scale: 0.79;
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
    font-size: 11px;
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
</style>