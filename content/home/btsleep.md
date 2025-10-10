# BTSleep

# Nan's MacBook Bluetooth disappears from time to time, it seems to be a problem that can be solved by setting the safe sleep options again in terminal as follows:

```
sudo pmset -a hibernatemode 0
```

For the default factory setting, use

```
sudo pmset -a hibernatemode 3
```

It may not be a complete fix, as it seems the problem mays still happen but less frequently.