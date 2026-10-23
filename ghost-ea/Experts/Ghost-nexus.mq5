//+------------------------------------------------------------------+
//| Ghost Nexus Mentor Autonomous EA                                 |
//|                                                                  |
//| REAL MT5 EXECUTION + GHOST NEXUS SIGNAL PUBLISHING              |
//|                                                                  |
//| Mentor EA:                                                       |
//|  1. Analyzes the market                                          |
//|  2. Generates BUY / SELL signals                                 |
//|  3. Opens trades on the Mentor MT5 account                      |
//|  4. Automatically places SL / TP                                |
//|  5. Manages its own trades                                      |
//|  6. Publishes executed signals to Ghost Nexus                   |
//|                                                                  |
//| Client APK ON/OFF DOES NOT CONTROL THIS EA.                     |
//+------------------------------------------------------------------+

#property strict
#property version   "4.00"
#property description "Ghost Nexus Mentor Autonomous Trading EA"

//====================================================================
// STANDARD LIBRARY
//====================================================================

#include <Trade/Trade.mqh>

CTrade Trade;


//====================================================================
// GHOST NEXUS CONNECTION
//====================================================================

input group "=== GHOST NEXUS CONNECTION ==="

input string MentorID =
   "GN-MTR-XXXXXXXX";

input string APIKey =
   "YOUR_MENTOR_API_KEY";

input string EA_ID =
   "GN-EA-001";

input string BackendURL =
   "http://127.0.0.1:8000";

input int HeartbeatSeconds =
   10;

input int RequestTimeout =
   5000;


//====================================================================
// TRADING SETTINGS
//====================================================================

input group "=== AUTONOMOUS TRADING ==="

input bool TradingEnabled =
   true;

input double LotSize =
   0.01;

input int MaxOpenTrades =
   3;

input long MagicNumber =
   911001;

input int SlippagePoints =
   30;


//====================================================================
// SIGNAL ENGINE
//====================================================================

input group "=== SIGNAL ENGINE ==="

input ENUM_TIMEFRAMES SignalTimeframe =
   PERIOD_M15;

input int FastEMAPeriod =
   9;

input int SlowEMAPeriod =
   21;

input int ATRPeriod =
   14;

input int BreakoutBars =
   20;

input double MinimumConfidence =
   70.0;

input double StopATRMultiplier =
   1.5;

input double TakeProfitATRMultiplier =
   2.5;

input int SignalCooldownSeconds =
   60;


//====================================================================
// RISK PROTECTION
//====================================================================

input group "=== RISK PROTECTION ==="

input double MaxDailyLossPercent =
   5.0;

input double MaxAccountDrawdownPercent =
   10.0;

input bool StopTradingAfterDailyLoss =
   true;

input bool StopTradingAfterDrawdown =
   true;


//====================================================================
// TRADE MANAGEMENT
//====================================================================

input group "=== TRADE MANAGEMENT ==="

input bool UseBreakEven =
   true;

input int BreakEvenTriggerPoints =
   300;

input int BreakEvenLockPoints =
   50;

input bool UseTrailingStop =
   true;

input int TrailingStopPoints =
   200;

input int TrailingStepPoints =
   50;


//====================================================================
// SYSTEM SETTINGS
//====================================================================

input group "=== SYSTEM ==="

input bool EnableHeartbeat =
   true;

input bool PublishSignals =
   true;

input bool ShowChartStatus =
   true;

input bool DebugMessages =
   true;


//====================================================================
// GLOBAL STATE
//====================================================================

bool BackendConnected = false;

bool MentorAuthenticated = false;

datetime LastHeartbeat = 0;

datetime LastSignalTime = 0;

datetime LastProcessedBar = 0;

string LastAction = "WAITING";

string LastSignalID = "";

double StartingDayBalance = 0.0;

int StartingDay = -1;


//====================================================================
// INITIALIZATION
//====================================================================

int OnInit()
{
   Print("=================================================");
   Print("GHOST NEXUS MENTOR AUTONOMOUS EA");
   Print("Version 4.00");
   Print("=================================================");

   Print("Mentor ID: ", MentorID);
   Print("EA ID: ", EA_ID);
   Print("Symbol: ", _Symbol);
   Print(
      "Timeframe: ",
      EnumToString(SignalTimeframe)
   );

   Print(
      "Backend: ",
      BackendURL
   );

   Print(
      "Trading Enabled: ",
      TradingEnabled
   );

   Print(
      "Lot Size: ",
      DoubleToString(
         LotSize,
         2
      )
   );

   Print(
      "Max Open Trades: ",
      MaxOpenTrades
   );

   Print(
      "Magic Number: ",
      MagicNumber
   );


   //===============================================================
   // VALIDATION
   //===============================================================

   if(StringLen(MentorID) < 5)
   {
      Print("ERROR: Mentor ID is missing.");

      return INIT_PARAMETERS_INCORRECT;
   }


   if(StringLen(APIKey) < 10)
   {
      Print("ERROR: Mentor API key is missing.");

      return INIT_PARAMETERS_INCORRECT;
   }


   if(StringLen(EA_ID) < 5)
   {
      Print("ERROR: EA ID is missing.");

      return INIT_PARAMETERS_INCORRECT;
   }


   if(StringLen(BackendURL) < 8)
   {
      Print("ERROR: Backend URL is invalid.");

      return INIT_PARAMETERS_INCORRECT;
   }


   if(LotSize <= 0)
   {
      Print("ERROR: Lot size must be greater than zero.");

      return INIT_PARAMETERS_INCORRECT;
   }


   if(MaxOpenTrades < 1)
   {
      Print("ERROR: MaxOpenTrades must be at least 1.");

      return INIT_PARAMETERS_INCORRECT;
   }


   //===============================================================
   // TRADE CONFIGURATION
   //===============================================================

   Trade.SetExpertMagicNumber(
      MagicNumber
   );

   Trade.SetDeviationInPoints(
      SlippagePoints
   );

   Trade.SetTypeFillingBySymbol(
      _Symbol
   );


   //===============================================================
   // DAILY BALANCE
   //===============================================================

   InitializeDailyBalance();


   //===============================================================
   // TIMER
   //===============================================================

   EventSetTimer(1);


   Print("=================================================");
   Print("EA INITIALIZED SUCCESSFULLY");
   Print("AUTONOMOUS TRADING ENGINE READY");
   Print("=================================================");

   return INIT_SUCCEEDED;
}


//====================================================================
// DEINITIALIZATION
//====================================================================

void OnDeinit(
   const int reason
)
{
   EventKillTimer();

   Comment("");

   Print(
      "Ghost Nexus Mentor EA stopped. Reason=",
      reason
   );
}


//====================================================================
// TIMER
//====================================================================

void OnTimer()
{
   UpdateDailyBalance();


   //===============================================================
   // HEARTBEAT
   //===============================================================

   datetime now =
      TimeCurrent();

   if(
      EnableHeartbeat &&
      (
         LastHeartbeat == 0 ||
         now - LastHeartbeat >= HeartbeatSeconds
      )
   )
   {
      SendHeartbeat();

      LastHeartbeat = now;
   }


   //===============================================================
   // TRADE MANAGEMENT
   //===============================================================

   ManageOpenTrades();


   //===============================================================
   // AUTONOMOUS SIGNAL ENGINE
   //===============================================================

   if(TradingEnabled)
   {
      ProcessTradingEngine();
   }


   //===============================================================
   // CHART
   //===============================================================

   if(ShowChartStatus)
   {
      UpdateChartStatus();
   }
}


//====================================================================
// TICK
//====================================================================

void OnTick()
{
   ManageOpenTrades();

   if(ShowChartStatus)
   {
      UpdateChartStatus();
   }
}


//====================================================================
// DAILY BALANCE INITIALIZATION
//====================================================================

void InitializeDailyBalance()
{
   MqlDateTime tm;

   TimeToStruct(
      TimeCurrent(),
      tm
   );

   StartingDay =
      tm.day_of_year;

   StartingDayBalance =
      AccountInfoDouble(
         ACCOUNT_BALANCE
      );
}


//====================================================================
// DAILY BALANCE UPDATE
//====================================================================

void UpdateDailyBalance()
{
   MqlDateTime tm;

   TimeToStruct(
      TimeCurrent(),
      tm
   );

   if(tm.day_of_year != StartingDay)
   {
      InitializeDailyBalance();

      Print(
         "New trading day detected. Daily balance reset."
      );
   }
}


//====================================================================
// DAILY LOSS PROTECTION
//====================================================================

bool DailyLossLimitReached()
{
   if(!StopTradingAfterDailyLoss)
   {
      return false;
   }

   if(StartingDayBalance <= 0)
   {
      return false;
   }

   double equity =
      AccountInfoDouble(
         ACCOUNT_EQUITY
      );

   double lossPercent =
      (
         (StartingDayBalance - equity)
         /
         StartingDayBalance
      )
      *
      100.0;

   if(lossPercent >= MaxDailyLossPercent)
   {
      Print(
         "DAILY LOSS LIMIT REACHED: ",
         DoubleToString(
            lossPercent,
            2
         ),
         "%"
      );

      return true;
   }

   return false;
}


//====================================================================
// ACCOUNT DRAWDOWN PROTECTION
//====================================================================

bool DrawdownLimitReached()
{
   if(!StopTradingAfterDrawdown)
   {
      return false;
   }

   double balance =
      AccountInfoDouble(
         ACCOUNT_BALANCE
      );

   double equity =
      AccountInfoDouble(
         ACCOUNT_EQUITY
      );

   if(balance <= 0)
   {
      return false;
   }

   double drawdown =
      (
         (balance - equity)
         /
         balance
      )
      *
      100.0;

   if(drawdown >= MaxAccountDrawdownPercent)
   {
      Print(
         "ACCOUNT DRAWDOWN LIMIT REACHED: ",
         DoubleToString(
            drawdown,
            2
         ),
         "%"
      );

      return true;
   }

   return false;
}


//====================================================================
// TRADING ENGINE
//====================================================================

void ProcessTradingEngine()
{
   if(DailyLossLimitReached())
   {
      LastAction =
         "DAILY LIMIT";

      return;
   }


   if(DrawdownLimitReached())
   {
      LastAction =
         "DRAWDOWN LIMIT";

      return;
   }


   int openTrades =
      CountOurOpenTrades();

   if(openTrades >= MaxOpenTrades)
   {
      LastAction =
         "MAX TRADES";

      return;
   }


   datetime currentBar =
      iTime(
         _Symbol,
         SignalTimeframe,
         0
      );

   if(currentBar <= 0)
   {
      return;
   }


   if(currentBar == LastProcessedBar)
   {
      return;
   }


   LastProcessedBar =
      currentBar;


   if(
      LastSignalTime > 0 &&
      TimeCurrent() - LastSignalTime <
      SignalCooldownSeconds
   )
   {
      LastAction =
         "COOLDOWN";

      return;
   }


   double buyConfidence =
      0.0;

   double sellConfidence =
      0.0;


   bool buySignal =
      CheckBuySignal(
         buyConfidence
      );


   bool sellSignal =
      CheckSellSignal(
         sellConfidence
      );


   if(!buySignal && !sellSignal)
   {
      LastAction =
         "WAITING";

      return;
   }


   //===============================================================
   // CHOOSE STRONGER SIGNAL
   //===============================================================

   if(
      buySignal &&
      (
         !sellSignal ||
         buyConfidence >= sellConfidence
      )
   )
   {
      if(
         buyConfidence >=
         MinimumConfidence
      )
      {
         ExecuteTrade(
            "BUY",
            buyConfidence
         );

         return;
      }
   }


   if(
      sellSignal &&
      (
         !buySignal ||
         sellConfidence > buyConfidence
      )
   )
   {
      if(
         sellConfidence >=
         MinimumConfidence
      )
      {
         ExecuteTrade(
            "SELL",
            sellConfidence
         );

         return;
      }
   }


   LastAction =
      "LOW CONFIDENCE";
}


//====================================================================
// BUY SIGNAL
//====================================================================

bool CheckBuySignal(
   double &confidence
)
{
   confidence = 0.0;


   double fast =
      GetEMA(
         FastEMAPeriod,
         1
      );


   double slow =
      GetEMA(
         SlowEMAPeriod,
         1
      );


   double previousFast =
      GetEMA(
         FastEMAPeriod,
         2
      );


   double previousSlow =
      GetEMA(
         SlowEMAPeriod,
         2
      );


   if(
      fast <= 0 ||
      slow <= 0 ||
      previousFast <= 0 ||
      previousSlow <= 0
   )
   {
      return false;
   }


   double closePrice =
      iClose(
         _Symbol,
         SignalTimeframe,
         1
      );


   double breakoutHigh =
      GetHighestHigh(
         BreakoutBars,
         2
      );


   if(
      closePrice <= 0 ||
      breakoutHigh <= 0
   )
   {
      return false;
   }


   bool bullishTrend =
      fast > slow;


   bool bullishCross =
      previousFast <= previousSlow &&
      fast > slow;


   bool breakout =
      closePrice > breakoutHigh;


   if(!bullishTrend)
   {
      return false;
   }


   confidence += 40.0;


   if(bullishCross)
   {
      confidence += 25.0;
   }


   if(breakout)
   {
      confidence += 25.0;
   }


   double previousClose =
      iClose(
         _Symbol,
         SignalTimeframe,
         2
      );


   if(closePrice > previousClose)
   {
      confidence += 10.0;
   }


   if(confidence > 100.0)
   {
      confidence = 100.0;
   }


   return (
      bullishCross ||
      breakout
   );
}


//====================================================================
// SELL SIGNAL
//====================================================================

bool CheckSellSignal(
   double &confidence
)
{
   confidence = 0.0;


   double fast =
      GetEMA(
         FastEMAPeriod,
         1
      );


   double slow =
      GetEMA(
         SlowEMAPeriod,
         1
      );


   double previousFast =
      GetEMA(
         FastEMAPeriod,
         2
      );


   double previousSlow =
      GetEMA(
         SlowEMAPeriod,
         2
      );


   if(
      fast <= 0 ||
      slow <= 0 ||
      previousFast <= 0 ||
      previousSlow <= 0
   )
   {
      return false;
   }


   double closePrice =
      iClose(
         _Symbol,
         SignalTimeframe,
         1
      );


   double breakoutLow =
      GetLowestLow(
         BreakoutBars,
         2
      );


   if(
      closePrice <= 0 ||
      breakoutLow <= 0
   )
   {
      return false;
   }


   bool bearishTrend =
      fast < slow;


   bool bearishCross =
      previousFast >= previousSlow &&
      fast < slow;


   bool breakout =
      closePrice < breakoutLow;


   if(!bearishTrend)
   {
      return false;
   }


   confidence += 40.0;


   if(bearishCross)
   {
      confidence += 25.0;
   }


   if(breakout)
   {
      confidence += 25.0;
   }


   double previousClose =
      iClose(
         _Symbol,
         SignalTimeframe,
         2
      );


   if(closePrice < previousClose)
   {
      confidence += 10.0;
   }


   if(confidence > 100.0)
   {
      confidence = 100.0;
   }


   return (
      bearishCross ||
      breakout
   );
}


//====================================================================
// EXECUTE TRADE
//====================================================================

void ExecuteTrade(
   string action,
   double confidence
)
{
   if(
      CountOurOpenTrades() >=
      MaxOpenTrades
   )
   {
      return;
   }


   double volume =
      NormalizeVolume(
         LotSize
      );


   if(volume <= 0)
   {
      Print(
         "Invalid normalized lot size."
      );

      return;
   }


   double ask =
      SymbolInfoDouble(
         _Symbol,
         SYMBOL_ASK
      );


   double bid =
      SymbolInfoDouble(
         _Symbol,
         SYMBOL_BID
      );


   if(
      ask <= 0 ||
      bid <= 0
   )
   {
      Print(
         "Unable to obtain market price."
      );

      return;
   }


   double entry;

   if(action == "BUY")
   {
      entry = ask;
   }
   else
   {
      entry = bid;
   }


   double atr =
      GetATR(
         ATRPeriod,
         1
      );


   if(atr <= 0)
   {
      Print(
         "ATR unavailable."
      );

      return;
   }


   double stopLoss = 0.0;

   double takeProfit = 0.0;


   if(action == "BUY")
   {
      stopLoss =
         entry -
         (
            atr *
            StopATRMultiplier
         );

      takeProfit =
         entry +
         (
            atr *
            TakeProfitATRMultiplier
         );
   }
   else
   {
      stopLoss =
         entry +
         (
            atr *
            StopATRMultiplier
         );

      takeProfit =
         entry -
         (
            atr *
            TakeProfitATRMultiplier
         );
   }


   AdjustStopsForBroker(
      action,
      entry,
      stopLoss,
      takeProfit
   );


   entry =
      NormalizeDouble(
         entry,
         _Digits
      );


   stopLoss =
      NormalizeDouble(
         stopLoss,
         _Digits
      );


   takeProfit =
      NormalizeDouble(
         takeProfit,
         _Digits
      );


   string comment =
      "Ghost Nexus " +
      EA_ID;


   bool result = false;


   if(action == "BUY")
   {
      result =
         Trade.Buy(
            volume,
            _Symbol,
            0.0,
            stopLoss,
            takeProfit,
            comment
         );
   }
   else
   {
      result =
         Trade.Sell(
            volume,
            _Symbol,
            0.0,
            stopLoss,
            takeProfit,
            comment
         );
   }


   if(!result)
   {
      Print("=================================================");
      Print("TRADE FAILED");
      Print("Action: ", action);
      Print(
         "Retcode: ",
         Trade.ResultRetcode()
      );
      Print(
         "Description: ",
         Trade.ResultRetcodeDescription()
      );
      Print("=================================================");

      LastAction =
         "TRADE FAILED";

      return;
   }


   ulong ticket =
      Trade.ResultOrder();


   if(ticket == 0)
   {
      ticket =
         Trade.ResultDeal();
   }


   LastSignalTime =
      TimeCurrent();

   LastAction =
      action;


   Print("=================================================");
   Print("GHOST NEXUS MENTOR TRADE OPENED");
   Print("Action: ", action);
   Print("Symbol: ", _Symbol);
   Print(
      "Volume: ",
      DoubleToString(
         volume,
         2
      )
   );
   Print(
      "Confidence: ",
      DoubleToString(
         confidence,
         2
      )
   );
   Print(
      "Entry: ",
      DoubleToString(
         entry,
         _Digits
      )
   );
   Print(
      "SL: ",
      DoubleToString(
         stopLoss,
         _Digits
      )
   );
   Print(
      "TP: ",
      DoubleToString(
         takeProfit,
         _Digits
      )
   );
   Print(
      "Ticket: ",
      ticket
   );
   Print("=================================================");


   //===============================================================
   // PUBLISH THE EXECUTED MENTOR TRADE
   //===============================================================

   if(PublishSignals)
   {
      PublishSignal(
         action,
         confidence,
         entry,
         stopLoss,
         takeProfit,
         volume,
         ticket
      );
   }
}


//====================================================================
// BROKER STOP VALIDATION
//====================================================================

void AdjustStopsForBroker(
   string action,
   double entry,
   double &stopLoss,
   double &takeProfit
)
{
   long stopsLevel =
      SymbolInfoInteger(
         _Symbol,
         SYMBOL_TRADE_STOPS_LEVEL
      );


   double minimumDistance =
      (double)stopsLevel *
      _Point;


   if(minimumDistance <= 0)
   {
      minimumDistance =
         10.0 *
         _Point;
   }


   if(action == "BUY")
   {
      if(
         entry - stopLoss <
         minimumDistance
      )
      {
         stopLoss =
            entry -
            minimumDistance;
      }


      if(
         takeProfit - entry <
         minimumDistance
      )
      {
         takeProfit =
            entry +
            minimumDistance;
      }
   }
   else
   {
      if(
         stopLoss - entry <
         minimumDistance
      )
      {
         stopLoss =
            entry +
            minimumDistance;
      }


      if(
         entry - takeProfit <
         minimumDistance
      )
      {
         takeProfit =
            entry -
            minimumDistance;
      }
   }
}


//====================================================================
// NORMALIZE VOLUME
//====================================================================

double NormalizeVolume(
   double volume
)
{
   double minimum =
      SymbolInfoDouble(
         _Symbol,
         SYMBOL_VOLUME_MIN
      );


   double maximum =
      SymbolInfoDouble(
         _Symbol,
         SYMBOL_VOLUME_MAX
      );


   double step =
      SymbolInfoDouble(
         _Symbol,
         SYMBOL_VOLUME_STEP
      );


   if(step <= 0)
   {
      return 0.0;
   }


   if(volume < minimum)
   {
      volume =
         minimum;
   }


   if(volume > maximum)
   {
      volume =
         maximum;
   }


   volume =
      MathFloor(
         volume / step
      )
      *
      step;


   int digits = 2;


   if(step == 1.0)
   {
      digits = 0;
   }
   else
   if(step == 0.1)
   {
      digits = 1;
   }
   else
   if(step == 0.01)
   {
      digits = 2;
   }
   else
   if(step == 0.001)
   {
      digits = 3;
   }


   return NormalizeDouble(
      volume,
      digits
   );
}


//====================================================================
// COUNT OUR TRADES
//====================================================================

int CountOurOpenTrades()
{
   int count = 0;


   for(
      int i = PositionsTotal() - 1;
      i >= 0;
      i--
   )
   {
      ulong ticket =
         PositionGetTicket(i);


      if(ticket == 0)
      {
         continue;
      }


      if(
         !PositionSelectByTicket(
            ticket
         )
      )
      {
         continue;
      }


      long magic =
         PositionGetInteger(
            POSITION_MAGIC
         );


      string symbol =
         PositionGetString(
            POSITION_SYMBOL
         );


      if(
         magic == MagicNumber &&
         symbol == _Symbol
      )
      {
         count++;
      }
   }


   return count;
}


//====================================================================
// MANAGE OPEN TRADES
//====================================================================

void ManageOpenTrades()
{
   for(
      int i = PositionsTotal() - 1;
      i >= 0;
      i--
   )
   {
      ulong ticket =
         PositionGetTicket(i);


      if(ticket == 0)
      {
         continue;
      }


      if(
         !PositionSelectByTicket(
            ticket
         )
      )
      {
         continue;
      }


      string symbol =
         PositionGetString(
            POSITION_SYMBOL
         );


      long magic =
         PositionGetInteger(
            POSITION_MAGIC
         );


      if(
         symbol != _Symbol ||
         magic != MagicNumber
      )
      {
         continue;
      }


      ManagePosition(
         ticket
      );
   }
}


//====================================================================
// MANAGE INDIVIDUAL POSITION
//====================================================================

void ManagePosition(
   ulong ticket
)
{
   if(
      !PositionSelectByTicket(
         ticket
      )
   )
   {
      return;
   }


   long type =
      PositionGetInteger(
         POSITION_TYPE
      );


   double openPrice =
      PositionGetDouble(
         POSITION_PRICE_OPEN
      );


   double currentSL =
      PositionGetDouble(
         POSITION_SL
      );


   double currentTP =
      PositionGetDouble(
         POSITION_TP
      );


   double bid =
      SymbolInfoDouble(
         _Symbol,
         SYMBOL_BID
      );


   double ask =
      SymbolInfoDouble(
         _Symbol,
         SYMBOL_ASK
      );


   if(
      openPrice <= 0 ||
      bid <= 0 ||
      ask <= 0
   )
   {
      return;
   }


   double newSL =
      currentSL;


   //===============================================================
   // BUY
   //===============================================================

   if(type == POSITION_TYPE_BUY)
   {
      double profitPoints =
         (
            bid -
            openPrice
         )
         /
         _Point;


      //============================================================
      // BREAK EVEN
      //============================================================

      if(
         UseBreakEven &&
         profitPoints >=
         BreakEvenTriggerPoints
      )
      {
         double breakEven =
            openPrice +
            (
               BreakEvenLockPoints *
               _Point
            );


         if(
            currentSL == 0.0 ||
            breakEven > currentSL
         )
         {
            newSL =
               breakEven;
         }
      }


      //============================================================
      // TRAILING STOP
      //============================================================

      if(
         UseTrailingStop &&
         profitPoints >=
         TrailingStopPoints
      )
      {
         double trailing =
            bid -
            (
               TrailingStopPoints *
               _Point
            );


         if(
            newSL == 0.0 ||
            trailing > newSL
         )
         {
            newSL =
               trailing;
         }
      }


      newSL =
         NormalizeDouble(
            newSL,
            _Digits
         );


      if(
         newSL > 0 &&
         (
            currentSL == 0.0 ||
            newSL >
            currentSL +
            (
               TrailingStepPoints *
               _Point
            )
         )
      )
      {
         Trade.PositionModify(
            ticket,
            newSL,
            currentTP
         );
      }
   }


   //===============================================================
   // SELL
   //===============================================================

   if(type == POSITION_TYPE_SELL)
   {
      double profitPoints =
         (
            openPrice -
            ask
         )
         /
         _Point;


      //============================================================
      // BREAK EVEN
      //============================================================

      if(
         UseBreakEven &&
         profitPoints >=
         BreakEvenTriggerPoints
      )
      {
         double breakEven =
            openPrice -
            (
               BreakEvenLockPoints *
               _Point
            );


         if(
            currentSL == 0.0 ||
            breakEven < currentSL
         )
         {
            newSL =
               breakEven;
         }
      }


      //============================================================
      // TRAILING STOP
      //============================================================

      if(
         UseTrailingStop &&
         profitPoints >=
         TrailingStopPoints
      )
      {
         double trailing =
            ask +
            (
               TrailingStopPoints *
               _Point
            );


         if(
            newSL == 0.0 ||
            trailing < newSL
         )
         {
            newSL =
               trailing;
         }
      }


      newSL =
         NormalizeDouble(
            newSL,
            _Digits
         );


      if(
         newSL > 0 &&
         (
            currentSL == 0.0 ||
            newSL <
            currentSL -
            (
               TrailingStepPoints *
               _Point
            )
         )
      )
      {
         Trade.PositionModify(
            ticket,
            newSL,
            currentTP
         );
      }
   }
}


//====================================================================
// EMA
//====================================================================

double GetEMA(
   int period,
   int shift
)
{
   int handle =
      iMA(
         _Symbol,
         SignalTimeframe,
         period,
         0,
         MODE_EMA,
         PRICE_CLOSE
      );


   if(handle == INVALID_HANDLE)
   {
      return 0.0;
   }


   double buffer[];

   ArraySetAsSeries(
      buffer,
      true
   );


   int copied =
      CopyBuffer(
         handle,
         0,
         shift,
         1,
         buffer
      );


   IndicatorRelease(
      handle
   );


   if(copied <= 0)
   {
      return 0.0;
   }


   return buffer[0];
}


//====================================================================
// ATR
//====================================================================

double GetATR(
   int period,
   int shift
)
{
   int handle =
      iATR(
         _Symbol,
         SignalTimeframe,
         period
      );


   if(handle == INVALID_HANDLE)
   {
      return 0.0;
   }


   double buffer[];

   ArraySetAsSeries(
      buffer,
      true
   );


   int copied =
      CopyBuffer(
         handle,
         0,
         shift,
         1,
         buffer
      );


   IndicatorRelease(
      handle
   );


   if(copied <= 0)
   {
      return 0.0;
   }


   return buffer[0];
}


//====================================================================
// HIGHEST HIGH
//====================================================================

double GetHighestHigh(
   int bars,
   int startShift
)
{
   double highest = 0.0;


   for(
      int i = startShift;
      i < startShift + bars;
      i++
   )
   {
      double value =
         iHigh(
            _Symbol,
            SignalTimeframe,
            i
         );


      if(value > highest)
      {
         highest = value;
      }
   }


   return highest;
}


//====================================================================
// LOWEST LOW
//====================================================================

double GetLowestLow(
   int bars,
   int startShift
)
{
   double lowest = 0.0;


   for(
      int i = startShift;
      i < startShift + bars;
      i++
   )
   {
      double value =
         iLow(
            _Symbol,
            SignalTimeframe,
            i
         );


      if(
         value > 0 &&
         (
            lowest == 0.0 ||
            value < lowest
         )
      )
      {
         lowest = value;
      }
   }


   return lowest;
}


//====================================================================
// PUBLISH SIGNAL TO GHOST NEXUS
//====================================================================

void PublishSignal(
   string action,
   double confidence,
   double entry,
   double stopLoss,
   double takeProfit,
   double volume,
   ulong ticket
)
{
   string url =
      BackendURL +
      "/ea/signal";


   string headers =
      "Content-Type: application/json\r\n";


   string reason =
      "Autonomous Mentor EA executed EMA trend/breakout signal.";


   string body = "{";


   body +=
      "\"mentor_id\":\"" +
      JsonEscape(
         MentorID
      ) +
      "\",";


   body +=
      "\"api_key\":\"" +
      JsonEscape(
         APIKey
      ) +
      "\",";


   body +=
      "\"ea_id\":\"" +
      JsonEscape(
         EA_ID
      ) +
      "\",";


   body +=
      "\"symbol\":\"" +
      JsonEscape(
         _Symbol
      ) +
      "\",";


   body +=
      "\"action\":\"" +
      JsonEscape(
         action
      ) +
      "\",";


   body +=
      "\"confidence\":" +
      DoubleToString(
         confidence,
         2
      ) +
      ",";


   body +=
      "\"entry\":" +
      DoubleToString(
         entry,
         _Digits
      ) +
      ",";


   body +=
      "\"stop_loss\":" +
      DoubleToString(
         stopLoss,
         _Digits
      ) +
      ",";


   body +=
      "\"take_profit\":" +
      DoubleToString(
         takeProfit,
         _Digits
      ) +
      ",";


   body +=
      "\"timeframe\":\"" +
      JsonEscape(
         EnumToString(
            SignalTimeframe
         )
      ) +
      "\",";


   body +=
      "\"strategy\":\"Ghost Nexus Mentor Autonomous EA\",";


   body +=
      "\"reason\":\"" +
      JsonEscape(
         reason
      ) +
      "\",";


   body +=
      "\"lot_size\":" +
      DoubleToString(
         volume,
         2
      ) +
      ",";


   body +=
      "\"ticket\":\"" +
      IntegerToString(
         (long)ticket
      ) +
      "\"";


   body += "}";


   string response;


   int code =
      SendPost(
         url,
         headers,
         body,
         response
      );


   if(
      code >= 200 &&
      code < 300
   )
   {
      BackendConnected =
         true;


      LastSignalID =
         ExtractJSONValue(
            response,
            "signal_id"
         );


      Print(
         "Ghost Nexus signal published successfully."
      );


      if(
         LastSignalID != ""
      )
      {
         Print(
            "Signal ID: ",
            LastSignalID
         );
      }


      if(DebugMessages)
      {
         Print(
            "Backend response: ",
            response
         );
      }


      return;
   }


   Print(
      "Ghost Nexus signal publishing failed. HTTP=",
      code
   );


   if(response != "")
   {
      Print(
         "Response: ",
         response
      );
   }
}


//====================================================================
// HEARTBEAT
//====================================================================

void SendHeartbeat()
{
   string url =
      BackendURL +
      "/ea/heartbeat";


   string headers =
      "Content-Type: application/json\r\n";


   string body = "{";


   body +=
      "\"mentor_id\":\"" +
      JsonEscape(
         MentorID
      ) +
      "\",";


   body +=
      "\"api_key\":\"" +
      JsonEscape(
         APIKey
      ) +
      "\",";


   body +=
      "\"ea_id\":\"" +
      JsonEscape(
         EA_ID
      ) +
      "\",";


   body +=
      "\"symbol\":\"" +
      JsonEscape(
         _Symbol
      ) +
      "\",";


   body +=
      "\"timeframe\":\"" +
      JsonEscape(
         EnumToString(
            SignalTimeframe
         )
      ) +
      "\",";


   body +=
      "\"account\":\"" +
      IntegerToString(
         (long)AccountInfoInteger(
            ACCOUNT_LOGIN
         )
      ) +
      "\",";


   body +=
      "\"broker\":\"" +
      JsonEscape(
         AccountInfoString(
            ACCOUNT_COMPANY
         )
      ) +
      "\",";


   body +=
      "\"server\":\"" +
      JsonEscape(
         AccountInfoString(
            ACCOUNT_SERVER
         )
      ) +
      "\",";


   body +=
      "\"balance\":" +
      DoubleToString(
         AccountInfoDouble(
            ACCOUNT_BALANCE
         ),
         2
      ) +
      ",";


   body +=
      "\"equity\":" +
      DoubleToString(
         AccountInfoDouble(
            ACCOUNT_EQUITY
         ),
         2
      ) +
      ",";


   body +=
      "\"profit\":" +
      DoubleToString(
         AccountInfoDouble(
            ACCOUNT_PROFIT
         ),
         2
      ) +
      ",";


   body +=
      "\"positions\":" +
      IntegerToString(
         CountOurOpenTrades()
      ) +
      ",";


   body +=
      "\"trading_enabled\":" +
      BoolToJSON(
         TradingEnabled
      ) +
      ",";


   body +=
      "\"status\":\"ONLINE\"";


   body += "}";


   string response;


   int code =
      SendPost(
         url,
         headers,
         body,
         response
      );


   if(
      code >= 200 &&
      code < 300
   )
   {
      BackendConnected =
         true;

      MentorAuthenticated =
         true;


      if(DebugMessages)
      {
         Print(
            "Ghost Nexus heartbeat OK. HTTP=",
            code
         );
      }


      return;
   }


   BackendConnected =
      false;

   MentorAuthenticated =
      false;


   Print(
      "Ghost Nexus heartbeat failed. HTTP=",
      code
   );


   if(response != "")
   {
      Print(
         "Heartbeat response: ",
         response
      );
   }
}


//====================================================================
// HTTP POST
//====================================================================

int SendPost(
   string url,
   string headers,
   string body,
   string &response
)
{
   char data[];

   char result[];


   ResetLastError();


   int length =
      StringToCharArray(
         body,
         data,
         0,
         StringLen(body)
      );


   if(length <= 0)
   {
      response = "";

      return -1;
   }


   string responseHeaders;


   int code =
      WebRequest(
         "POST",
         url,
         headers,
         RequestTimeout,
         data,
         result,
         responseHeaders
      );


   if(code == -1)
   {
      int error =
         GetLastError();


      Print(
         "WebRequest error: ",
         error
      );


      response = "";

      return -1;
   }


   response =
      CharArrayToString(
         result
      );


   return code;
}


//====================================================================
// JSON ESCAPE
//====================================================================

string JsonEscape(
   string value
)
{
   StringReplace(
      value,
      "\\",
      "\\\\"
   );


   StringReplace(
      value,
      "\"",
      "\\\""
   );


   StringReplace(
      value,
      "\r",
      "\\r"
   );


   StringReplace(
      value,
      "\n",
      "\\n"
   );


   return value;
}


//====================================================================
// BOOL -> JSON
//====================================================================

string BoolToJSON(
   bool value
)
{
   if(value)
   {
      return "true";
   }

   return "false";
}


//====================================================================
// EXTRACT JSON STRING
//====================================================================

string ExtractJSONValue(
   string json,
   string key
)
{
   string search =
      "\"" +
      key +
      "\":\"";


   int start =
      StringFind(
         json,
         search
      );


   if(start < 0)
   {
      return "";
   }


   start +=
      StringLen(
         search
      );


   int finish =
      StringFind(
         json,
         "\"",
         start
      );


   if(finish < 0)
   {
      return "";
   }


   return StringSubstr(
      json,
      start,
      finish - start
   );
}


//====================================================================
// CHART STATUS
//====================================================================

void UpdateChartStatus()
{
   string status =
      "GHOST NEXUS MENTOR EA\n";

   status +=
      "============================\n";


   status +=
      "Mentor: " +
      MentorID +
      "\n";


   status +=
      "EA ID: " +
      EA_ID +
      "\n";


   status +=
      "Symbol: " +
      _Symbol +
      "\n";


   status +=
      "Timeframe: " +
      EnumToString(
         SignalTimeframe
      ) +
      "\n";


   status +=
      "Trading: ";


   if(TradingEnabled)
   {
      status +=
         "ON\n";
   }
   else
   {
      status +=
         "OFF\n";
   }


   status +=
      "Backend: ";


   if(BackendConnected)
   {
      status +=
         "CONNECTED\n";
   }
   else
   {
      status +=
         "OFFLINE\n";
   }


   status +=
      "Authentication: ";


   if(MentorAuthenticated)
   {
      status +=
         "OK\n";
   }
   else
   {
      status +=
         "WAITING\n";
   }


   status +=
      "Open Trades: " +
      IntegerToString(
         CountOurOpenTrades()
      ) +
      "/" +
      IntegerToString(
         MaxOpenTrades
      ) +
      "\n";


   status +=
      "Last Action: " +
      LastAction +
      "\n";


   if(
      LastSignalID != ""
   )
   {
      status +=
         "Signal: " +
         LastSignalID +
         "\n";
   }


   Comment(status);
}
//+------------------------------------------------------------------+