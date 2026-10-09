package com.clinic.model;

/**
 * Patient model: id, name, age
 */
public class Patient {
    private int id;
    private String name;
    private Integer age;

    public Patient() {}

    public Patient(int id, String name, Integer age) {
        this.id = id;
        this.name = name;
        this.age = age;
    }

    public Patient(String name, Integer age) {
        this(0, name, age);
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    @Override
    public String toString() {
        return "Patient{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", age=" + age +
                '}';
    }
}
