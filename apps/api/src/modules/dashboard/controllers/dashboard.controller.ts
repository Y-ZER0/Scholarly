import { Controller, Get } from "@nestjs/common";
import { Public } from "@/shared/decorators/public.decorator";
import { DashboardService } from "../services/dashboard.service";

@Controller("dashboard")
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get("stats")
  @Public()
  async getStats() {
    const data = await this.dashboardService.getStats();
    return { success: true, data };
  }

  @Get("charts")
  @Public()
  async getCharts() {
    const data = await this.dashboardService.getCharts();
    return { success: true, data };
  }

  @Get("recent")
  @Public()
  async getRecent() {
    const data = await this.dashboardService.getRecent();
    return { success: true, data };
  }
}
