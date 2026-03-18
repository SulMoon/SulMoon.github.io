---
layout: post
title:  "Doc Test"
date:   2026-03-18 22:51:27 +0800
categories: jekyll update
---

## 1.ScriptableObject使用方法
- ### 普通创建
```csharp
  [CreateAssetMenu (fileName = "MyData", menuName = "自定义/MyData")]
  public class MyData : ScriptableObject
```
- ### 用代码去创建SO
```csharp
  // 创建实例
  MyData myData = ScriptableObject.CreateInstance<MyData>();
  // 创建对应SO资产，并保存
  AssetDatabase.CreateAsset(myData, "Assets/MyData.asset");
  // 告诉Unity这是修改过需要保存的数据
  EditorUtility.SetDirty (this);
  // 保存数据
  AssetDatabase.SaveAssets ();
```
