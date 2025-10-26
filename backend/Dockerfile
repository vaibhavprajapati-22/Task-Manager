FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY TasksApi.csproj .
RUN dotnet restore TasksApi.csproj

COPY . .

RUN dotnet publish TasksApi.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .
EXPOSE 5000

ENV ASPNETCORE_URLS=http://+:5000
ENTRYPOINT ["dotnet", "TasksApi.dll"]
