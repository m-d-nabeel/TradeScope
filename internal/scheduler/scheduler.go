package scheduler

// import (
// 	"log"

// 	"github.com/robfig/cron/v3"
// 	"github.com/trading-backend/internal/server"
// )

// func StartScheduler() {
// 	c := cron.New()

// 	// Schedule the task to run every 15 minutes
// 	_, err := c.AddFunc("*/15 * * * *", func() {
// 	})
// 	if err != nil {
// 		log.Fatalf("Error adding cron job: %v", err)
// 	}

// 	c.Start()

// 	// Keep the scheduler running
// 	select {}
// }
